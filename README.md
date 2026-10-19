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
npx degit slide-ng/starter my-talk
cd my-talk
```

(`npx @slide-ng/core create my-talk` makes a smaller deck without the tutorial.)

## Run

You need Node 22.22.3 or newer.

```sh
npm install
npm run dev        # http://localhost:4230, reloads when you edit slides.md
npm run build      # static site in dist/
npm run export     # slides-export.pdf, needs Chromium (CHROME_PATH if not found)
npm run format     # tidies the markdown
```

## What is in the folder

| path                          | what it is                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `slides.md`                   | the deck: headmatter, then one slide per `---`                               |
| `components/`                 | your own Angular components, usable as tags in slides                        |
| `setup/`                      | `main.ts` lists the ng-icons icons the deck uses                             |
| `snippets/`                   | code files shown with `<<< @/snippets/greeter.ts#greeter`                    |
| `pages/`                      | slides in other markdown files, pulled in with `src: ./pages/more-slides.md` |
| `public/`                     | pictures and other files                                                     |
| `tests/smoke.mjs`             | builds the deck and opens every slide in Chromium (`npm test`)               |
| `netlify.toml`, `vercel.json` | hosting settings                                                             |
| `.github/workflows/`          | `deploy.yml` (GitHub Pages) and `export.yml` (PDF artifact)                  |

Syntax, themes, export options, offline mode and deployment are covered in the documentation at [slide-ng.dev](https://slide-ng.dev).

## For the repository owner

Mark the repository as a template (Settings > Template repository). The workflows use `npm ci` with the committed `package-lock.json`; update it with `npm install` when you change the `@slide-ng/core` range in `package.json`.

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

MIT License © 2026 [Erkam Yaman](https://github.com/erkamyaman) ([LICENSE](LICENSE)). The demo deck was modelled on the starter deck of Slidev (MIT, Anthony Fu and Slidev contributors); the licence text is in [NOTICE](NOTICE).

## Disclaimer

slide.ng is an independent open-source project. It is not affiliated with or endorsed by the Angular team or Google, or by Slidev. Angular is a trademark of Google LLC. Slidev is a project of its own maintainers. The names are used only to describe what slide.ng works with or is based on. This is a plain notice, not legal advice.
