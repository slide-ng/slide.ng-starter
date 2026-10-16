<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/readme-banner-dark.png">
  <img alt="slide.ng" src="assets/readme-banner-light.png" width="800">
</picture>

# slide.ng starter

A template for [slide.ng](https://github.com/slide-ng/slide.ng): presentations written in markdown, with Angular template syntax inside.
The deck in `slides.md` is a short tutorial. Read it, then replace it with your own talk.

## Use as a template

On GitHub press **Use this template** (the repository must be marked as a template in Settings), or from a terminal:

```sh
npx degit slide-ng/slide.ng-starter my-talk
cd my-talk
```

(`npx slide-ng create my-talk` makes a smaller deck without the tutorial.)

## Run

You need Node 22.22.3 or newer (`.nvmrc` says `22`).

```sh
npm install
npm run dev        # http://localhost:4230, reloads when you edit slides.md
```

## What is in the folder

| path | what it is |
| --- | --- |
| `slides.md` | the deck: headmatter, then one slide per `---` |
| `components/` | your own Angular components, usable as tags in slides (`counter.ts`) |
| `snippets/` | code files shown with `<<< @/snippets/greeter.ts#greeter` |
| `pages/` | slides in other markdown files, pulled in with `src: ./pages/more-slides.md` |
| `public/` | pictures and other files, written in slides as `/cover.svg` |
| `tests/smoke.mjs` | builds the deck and opens every slide in Chromium (see Test) |
| `netlify.toml`, `vercel.json` | hosting settings |
| `.github/workflows/` | `deploy.yml` (GitHub Pages) and `export.yml` (PDF artifact) |

## Edit

Open `slides.md` and change it. The syntax is in the slide.ng documentation (`docs/SYNTAX.md` in the slide.ng repository).
`npm run format` tidies the markdown.

## Present

Press `Space` or the arrow keys. `o` shows the overview, `g` goes to a slide, `d` switches dark mode, `f` is fullscreen.
Move the mouse to the bottom left for the bar: presenter view (notes, timer, next step), drawing, and settings.
The presenter window and the audience window follow each other.

## Export

```sh
npm run export                       # slides-export.pdf, needs Chromium
npm run export -- --with-clicks      # one page per click step
npm run export -- --format pptx      # also png and md
```

slide.ng never downloads a browser. Set `CHROME_PATH=/path/to/chrome` (or pass `--executable-path`) if it is not found.

## Deploy

`npm run build` writes a static site to `dist/`.

- **GitHub Pages**: Settings > Pages > Source: GitHub Actions, then push to `main`. `.github/workflows/deploy.yml` builds with `--base /<repository-name>/` (and `/` for a `<user>.github.io` repository), so the deck is at `https://<user>.github.io/<repository>/`.
- **Netlify** and **Vercel**: import the repository. `netlify.toml` and `vercel.json` set the build command, the `dist` folder and the rewrite that lets addresses like `/3` open the app.
- **PDF**: the `Export PDF` workflow (run it by hand, or push a tag like `v1`) attaches `slides.pdf` to the run.

## Offline mode

For a room without internet:

```sh
npx slide-ng build --offline --out talk-offline
```

Copy `talk-offline` to the presenting machine and open `index.html` in Chrome or Edge. No server and no first visit online are needed.
Pictures and fonts from other servers are downloaded into the folder. Keep a PDF as a second plan.
The full checklist is `docs/OFFLINE.md` in the slide.ng repository.

## Themes

Change `theme:` in the first lines of `slides.md`. `default` is built in. The official themes are packages from the separate
[slide.ng-themes](https://github.com/slide-ng/slide.ng-themes) repository, named `@slide-ng/theme-<name>`:

```sh
npm i -D @slide-ng/theme-seriph     # then: theme: seriph
```

Others: `shibainu`, `bricks`, `apple-basic`. `npx slide-ng theme eject` copies the theme in use into `./theme` so you can edit it.

## Test

`tests/smoke.mjs` copies the deck to a temporary folder, links a slide.ng checkout into its `node_modules`, builds it, opens every slide in
Chromium (no console errors, no failed requests, the custom component works) and exports a PDF with one page per slide.

```sh
SLIDE_NG_DIR=../slide.ng npm test       # the default is ../slide.ng; CHROME_PATH picks the browser
```

It takes a few minutes. The slide.ng checkout needs its own `npm install` first.

## For the repository owner

slide.ng is not on the npm registry yet, so `package.json` has a placeholder: `"slide-ng": "latest"`. After the first release:

1. Replace `latest` with the real range, for example `^0.1.0` (the same thing `slide-ng create` writes).
2. Run `npm install`, commit `package-lock.json`, and change `npm install` to `npm ci` in both workflows.
3. Mark the repository as a template (Settings > Template repository).

Before the release, to try the deck with a local checkout without touching the repository, link it only in a copy
(`npm test` does this) or run `npm install --no-save ../slide.ng` and do not commit the result.
The URLs in this file (`github.com/slide-ng/...`) are placeholders for the final repository locations.

## Maintainers

<!-- prettier-ignore-start -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/erkamyaman"><img src="https://avatars.githubusercontent.com/u/88717125?v=4&s=100" width="100px;" alt="Erkam Yaman"/><br /><sub><b>Erkam Yaman</b></sub></a><br /><sub>Maintainer</sub></td>
    </tr>
  </tbody>
</table>
<!-- prettier-ignore-end -->

## Sponsors

This starter is free and open source. If it helps your work, please consider sponsoring it. Your support keeps development going.

<p>
  <a href="https://github.com/sponsors/erkamyaman"><img src="https://img.shields.io/badge/Sponsor-%E2%9D%A4-db61a2?logo=githubsponsors&logoColor=white" alt="Sponsor on GitHub" /></a>
</p>

## License

MIT, see [LICENSE](LICENSE). The demo deck was modelled on the starter deck of Slidev (MIT, Anthony Fu and Slidev contributors); the licence text is in [NOTICE](NOTICE).

## Disclaimer

slide.ng is an independent open-source project. It is not affiliated with or endorsed by the Angular team or Google, or by Slidev. Angular is a trademark of Google LLC. Slidev is a project of its own maintainers. The names are used only to describe what slide.ng works with or is based on. This is a plain notice, not legal advice.
