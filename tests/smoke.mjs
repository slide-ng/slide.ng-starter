// Smoke test: builds the deck, opens every slide in Chromium and exports a PDF.
//
//   node tests/smoke.mjs                               (uses the installed @slide-ng/core, run `npm install` first)
//   SLIDE_NG_DIR=../slide.ng node tests/smoke.mjs      (uses a local slide.ng checkout; decks with other Angular libraries such as ng-icons need the installed one)
//   CHROME_PATH=/path/to/chrome                        (default: /opt/pw-browsers/chromium-1194/chrome-linux/chrome)
//
// The deck is copied to a temporary folder with node_modules linked in, so nothing in this repository changes.
import { execFileSync } from 'node:child_process';
import { cpSync, createReadStream, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = resolve(fileURLToPath(import.meta.url), '../..');
const local = process.env.SLIDE_NG_DIR ? resolve(here, process.env.SLIDE_NG_DIR) : null;
const core = local ?? resolve(here, 'node_modules/@slide-ng/core');
const chrome = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
if (!existsSync(join(core, 'bin/slide-ng.mjs'))) throw new Error(`No slide.ng in ${core}. Run npm install, or set SLIDE_NG_DIR.`);
const { chromium } = createRequire(join(core, 'package.json'))('playwright-core');

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
  if (!ok) failed++;
};

// Copy the deck without git, dependencies and earlier output.
const work = mkdtempSync(join(tmpdir(), 'slide-ng-starter-'));
const skip = new Set(['.git', 'node_modules', 'dist', '.slide-ng']);
cpSync(here, work, { recursive: true, filter: (src) => !skip.has(src.slice(here.length + 1).split('/')[0]) });
if (local) {
  mkdirSync(join(work, 'node_modules/@slide-ng'), { recursive: true });
  symlinkSync(core, join(work, 'node_modules/@slide-ng/core'), 'dir');
} else {
  symlinkSync(join(here, 'node_modules'), join(work, 'node_modules'), 'dir');
}
const bin = join(work, 'node_modules/@slide-ng/core/bin/slide-ng.mjs');
const run = (...args) => execFileSync(process.execPath, [bin, ...args], { cwd: work, encoding: 'utf8', env: { ...process.env, CHROME_PATH: chrome } });

const built = run('build');
const slides = Number(/Built (\d+) slides/.exec(built)?.[1]);
check('build writes dist/index.html', existsSync(join(work, 'dist/index.html')) && slides > 0, `${slides} slides`);

// Serve dist like a single page app (unknown paths open index.html).
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let file = join(work, 'dist', decodeURIComponent(req.url.split('?')[0]));
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(work, 'dist/index.html');
  res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
  createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(0, ok));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
try {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  const problems = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(m.text()); });
  page.on('pageerror', (e) => problems.push(String(e)));
  // Requests cut off by going to the next slide (ERR_ABORTED) are not failures.
  page.on('requestfailed', (r) => { if (r.failure()?.errorText !== 'net::ERR_ABORTED') problems.push(`request failed: ${r.url()}`); });
  page.on('response', (r) => { if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });

  const empty = [];
  for (let n = 1; n <= slides; n++) {
    await page.goto(`${origin}/${n}`);
    await page.waitForFunction((n) => document.querySelector('#hud')?.innerText.startsWith(`slide ${n}/`), n);
    await page.waitForTimeout(150);
    const text = await page.evaluate(() => [...document.querySelectorAll('.slidev-layout')].map((e) => e.innerText).join(''));
    if (!text.trim()) empty.push(n);
  }
  check(`all ${slides} slides open and have content`, empty.length === 0, empty.length ? `empty: ${empty}` : '');

  await page.goto(`${origin}/1`);
  await page.waitForFunction(() => document.querySelector('h1'));
  check('the first slide shows the title', (await page.locator('h1').first().innerText()) === 'Welcome to slide.ng');
  check('the page title is the deck title', (await page.title()).includes('Welcome to slide.ng'), await page.title());

  // The custom component (components/counter.ts) works: the plus button counts.
  for (let n = 1; n <= slides; n++) {
    await page.goto(`${origin}/${n}`);
    await page.waitForFunction((n) => document.querySelector('#hud')?.innerText.startsWith(`slide ${n}/`), n);
    if (await page.locator('starter-counter').count()) {
      await page.locator('starter-counter button').nth(1).click();
      check('the custom counter component renders and counts', (await page.locator('starter-counter span').innerText()).trim() === '11', `slide ${n}`);
      break;
    }
    if (n === slides) check('the custom counter component renders and counts', false, 'no starter-counter on any slide');
  }

  check('no console errors, warnings or failed requests', problems.length === 0, problems.join(' | '));
} finally {
  await browser.close();
  server.close();
}

// Export to PDF with the same Chromium and compare the page count with the slides.
run('export', '--output', join(work, 'deck.pdf'));
// slide.ng uses the maintained fork @cantoo/pdf-lib (older versions used pdf-lib itself).
const coreRequire = createRequire(join(core, 'package.json'));
const pdfLib = () => {
  try {
    return coreRequire('@cantoo/pdf-lib');
  } catch {
    return coreRequire('pdf-lib');
  }
};
const { PDFDocument } = pdfLib();
const pages = (await PDFDocument.load(readFileSync(join(work, 'deck.pdf')))).getPageCount();
check('the PDF has one page per slide', pages === slides, `${pages} pages, ${slides} slides`);

rmSync(work, { recursive: true, force: true });
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
