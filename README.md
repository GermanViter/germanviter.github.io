# portfolio

My personal site: who I am, the projects I am proudest of, and where I have worked.

Built with TypeScript, Vite and React. The look borrows from [omarchy.org](https://omarchy.org):
sharp corners, a monospace font, pixel art and a dithered background, all in
[Catppuccin](https://catppuccin.com) colors.

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

Keyboard: `1` `2` `3` switch pages, `t` cycles the Catppuccin flavor
(Mocha, Macchiato, Frappé, Latte). The choice is saved in `localStorage`.

## Editing the content

All text lives in `src/data/`, separate from the components:

| File            | Content                                                        |
| --------------- | -------------------------------------------------------------- |
| `profile.ts`    | Name, links, fastfetch rows, the "about" cards, the toolbox    |
| `timeline.ts`   | The developer history shown as a git log                       |
| `projects.ts`   | Pinned repos, dotfiles tree, work in progress, other repos     |
| `experience.ts` | Jobs                                                           |
| `nav.ts`        | Pages and their keyboard shortcuts                             |

Project screenshots are in `src/assets/projects/`.

## Pixel art

Everything pixelated is drawn from plain text, no image files:

- `src/pixel/font.ts` is a 5×7 bitmap font. `<PixelText text="..." />` renders it.
- `src/pixel/sprites.ts` holds the sprites as rows of characters, one character per
  pixel, mapped to Catppuccin colors. `<Sprite name="..." />` renders one.
- `src/pixel/PixelField.tsx` paints the square field behind the page on a canvas.

To add a sprite, add an entry to `SPRITES` and use its key as the `name`.

## Theming

`src/styles/theme.css` defines the four Catppuccin flavors as CSS variables, then maps
them to roles (`--bg`, `--fg`, `--accent`, and so on). Components use the roles, so a
flavor switch is just a different `data-flavor` on `<html>`.

## Deploying

The build uses relative asset paths and hash-based routing, so `dist/` can be dropped on
any static host (GitHub Pages included) without extra configuration.
