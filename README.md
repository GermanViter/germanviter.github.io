# portfolio

My personal site: who I am, the projects I am proudest of, and where I have worked.

Built with TypeScript, Vite and React. The look borrows from [omarchy.org](https://omarchy.org):
sharp corners, a monospace font, pixel art and a dithered background. It ships with
seven themes: the four [Catppuccin](https://catppuccin.com) flavors (Mocha is the
default), [Gruvbox](https://github.com/morhetz/gruvbox) dark and light, and
[Tokyo Night](https://github.com/folke/tokyonight.nvim).

## Run it

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # type-check and build into dist/
npm run preview   # serve the production build
npm run lint
```

## Pages

| Route          | What is on it                                                        |
| -------------- | -------------------------------------------------------------------- |
| `/`            | Intro, fastfetch card, about, toolbox, developer history, social links |
| `/projects`    | Pinned repos, the dotfiles family, work in progress, everything else  |
| `/experience`  | Work experience                                                       |

Keyboard: `1` `2` `3` switch pages, `t` jumps to the next theme. The theme menu in the
top bar lists all of them. The choice is saved in `localStorage`.

## Editing the content

All text lives in `src/data/`, separate from the components:

| File            | Content                                                        |
| --------------- | -------------------------------------------------------------- |
| `profile.ts`    | Name, links, fastfetch rows, the "about" cards, the toolbox    |
| `timeline.ts`   | The developer history shown as a git log                       |
| `projects.ts`   | Pinned repos, dotfiles tree, work in progress, other repos     |
| `experience.ts` | Turns the jobs in `resume.yaml` into cards (see below)         |
| `nav.ts`        | Pages and their keyboard shortcuts                             |
| `themes.ts`     | The list of themes shown in the theme menu                     |

Project screenshots are in `src/assets/projects/`.

### Pinned repos

Which repos are pinned, and their language, creation date and order, come straight
from my GitHub profile. `scripts/fetch-pins.ts` runs before `npm run dev` and
`npm run build` and writes `src/data/pinned.generated.json` (not committed). It needs
a GitHub token: `GITHUB_TOKEN` if set, otherwise the one `gh` is logged in with.

The writing stays by hand, in `overrides` in `projects.ts`, keyed by repo name:
tagline, description, highlights, tags, sprite and screenshot. A repo with no
override yet falls back to its GitHub description, topics and social preview.

The deploy workflow also runs once a day, so pinning or unpinning a repo on GitHub
shows up on the site without a commit.

### GitHub activity

The top of the Projects page shows my contribution graph for the last year, a pixel
pie of the languages in my public repos (forks excluded, measured in bytes, as GitHub
does), and a few stats drawn from the graph. `scripts/fetch-activity.ts` runs next to
`fetch-pins.ts`, with the same token, and writes `src/data/activity.generated.json`
(not committed). The daily deploy keeps the graph current.

### Work experience

`resume.yaml` at the repo root is my résumé in the [JSON Resume](https://jsonresume.org/schema)
format, and the single source of truth for the Experience page. To add a job, add an
entry to `work` (most recent first) and push to master: the deploy workflow rebuilds the
site, and the file's git history tracks every change. In `npm run dev` the page reloads
as soon as the file is saved.

- No `endDate` means the job is current. Dates are `"YYYY-MM"` or `"YYYY"`, in quotes.
- `highlights` become the bullet list under the job title.
- `x-en` holds the English `position` and `highlights` for the site. Without it, the
  site shows the French text.
- `x-sprite` picks the pixel art. Without it, `experience.ts` picks one from keywords in
  the position (`spriteKeywords`), and falls back to `briefcase`. Job sprites so far:
  `shield`, `coffee`, `pi`, `book`, `computer`, `lifebuoy`, `cart`, `wrench`, `box`,
  `briefcase`. For a new kind of job, draw a sprite in `sprites.ts` and add its
  keywords to `spriteKeywords`.

A malformed entry fails the build with a message naming it, so the site keeps its last
good deploy.

## Pixel art

Everything pixelated is drawn from plain text, no image files:

- `src/pixel/font.ts` is a 5×7 bitmap font. `<PixelText text="..." />` renders it.
- `src/pixel/sprites.ts` holds the sprites as rows of characters, one character per
  pixel, mapped to Catppuccin colors. `<Sprite name="..." />` renders one.
- `src/pixel/PixelField.tsx` paints the square field behind the page on a canvas.

To add a sprite, add an entry to `SPRITES` and use its key as the `name`.

## Theming

`src/styles/theme.css` gives every theme the same 26 color slots, named after the
Catppuccin palette, then maps them to roles (`--bg`, `--fg`, `--accent`, and so on).
Components use the roles, so switching themes is just a different `data-theme` on
`<html>`.

To add a theme:

1. Add a `:root[data-theme='your-id']` block to `theme.css` that fills the 26 slots.
   For a light theme, also add it to the "Light themes" rule below the roles.
2. Add an entry to `THEMES` in `src/data/themes.ts`.
3. Add the id to the list in the inline script in `index.html`, so the saved theme is
   applied before first paint.

## Deploying

The build uses relative asset paths and hash-based routing, so `dist/` can be dropped on
any static host (GitHub Pages included) without extra configuration.
