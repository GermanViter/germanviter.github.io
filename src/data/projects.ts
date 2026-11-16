import type { SpriteName } from '../pixel/sprites'
import type { GithubPin } from './github-pin'
import fetchedPins from './pinned.generated.json'
import linuxDots from '../assets/projects/linux-dots.webp'
import macosDots from '../assets/projects/macos-dots.webp'
import omarchyDots from '../assets/projects/omarchy-dots.webp'
import snakeGame from '../assets/projects/snake-game.webp'
import spotifyEsp32 from '../assets/projects/spotify-esp32.webp'

const GITHUB = 'https://github.com/GermanViter'

export const repoUrl = (name: string) => `${GITHUB}/${name}`

/** GitHub's language colors, remapped onto the Catppuccin palette. */
const languageHue: Record<string, string> = {
  Lua: 'blue',
  Python: 'yellow',
  Shell: 'green',
  JavaScript: 'peach',
  TypeScript: 'sapphire',
  Java: 'red',
  Rust: 'maroon',
  C: 'lavender',
  QML: 'teal',
  CSS: 'mauve',
  Images: 'pink',
}

const hues = [...new Set(Object.values(languageHue))]

/** The palette color for a language. One I have not mapped yet still gets a stable color of its own. */
export function hueOf(language: string): string {
  if (Object.hasOwn(languageHue, language)) return languageHue[language]
  let sum = 0
  for (let index = 0; index < language.length; index++) sum += language.charCodeAt(index)
  return hues[sum % hues.length]
}

const languageSprite: Record<string, SpriteName> = {
  Python: 'snake',
  Lua: 'moon',
  Java: 'coffee',
  Shell: 'terminal',
}

export type Media =
  | { kind: 'image'; src: string; alt: string; fit: 'cover' | 'contain'; background?: string; pixelated?: boolean }
  | { kind: 'code' }
  /** Nothing to show yet: the card draws the repo's sprite instead. */
  | { kind: 'placeholder' }

/** The writing for a pinned repo. Anything left out falls back to what GitHub says. */
interface PinOverride {
  tagline?: string
  description?: string
  highlights?: string[]
  tags?: string[]
  sprite?: SpriteName
  media?: Media
}

/**
 * Hand-written content, keyed by repo name. Which repos are pinned, and in what
 * order, comes from GitHub: an entry here only shows up while its repo is pinned.
 */
const overrides: Partial<Record<string, PinOverride>> = {
  linux_dots: {
    tagline: 'Hyprland and Caelestia shell dotfiles',
    description:
      'My Linux config: Hyprland running the Caelestia shell, with Zsh, Kitty, Starship, Fastfetch and Neovim on top. It is the first repo I ever pushed.',
    highlights: [
      'One install script detects the package manager and installs what is missing',
      'Every app lives in its own folder and gets symlinked with GNU Stow',
      'Private settings stay out of git through local override files',
    ],
    tags: ['Hyprland', 'Caelestia', 'Lua', 'Shell', 'GNU Stow'],
    sprite: 'tux',
    media: {
      kind: 'image',
      src: linuxDots,
      alt: 'Fastfetch output in a Kitty terminal on CachyOS with Hyprland',
      fit: 'cover',
    },
  },
  snakeGame: {
    tagline: "Snake, inspired by Google's version",
    description:
      'The classic, written in Python with Pygame. Eat apples, grow, do not hit the wall. It ships with its own sprites for the head, body and tail of the snake.',
    highlights: [
      'Score tracking with a high score saved locally',
      'Sound effects, background music and a start screen',
      'The game speeds up as the snake gets longer',
    ],
    tags: ['Python', 'Pygame'],
    sprite: 'snake',
    media: {
      kind: 'image',
      src: snakeGame,
      alt: 'Snake game start screen: press enter to start, high score 41',
      fit: 'contain',
      background: '#a8d059',
      pixelated: true,
    },
  },
  omarchy_dots: {
    tagline: 'My own configuration for Omarchy',
    description:
      'The setup I run on Omarchy: Hyprland keybindings, Kitty, Zsh, Starship and Fastfetch, installed by one script built on the Omarchy CLI.',
    highlights: [
      'Dependencies are installed through omarchy pkg add, then linked with GNU Stow',
      'Third-party shell plugins are tracked in a plain text list',
      'A wrapper around omarchy plugin add keeps that list in sync and commits it for me',
    ],
    tags: ['Omarchy', 'Hyprland', 'Shell', 'Lua'],
    sprite: 'tiles',
    media: {
      kind: 'image',
      src: omarchyDots,
      alt: 'Fastfetch output on Omarchy with Hyprland and Kitty',
      fit: 'cover',
    },
  },
  'init.lua': {
    tagline: 'Neovim configuration, from scratch',
    description:
      'My editor, one plugin file at a time. No distribution underneath: just lazy.nvim and the plugins I actually use, themed with Catppuccin Mocha on a transparent background.',
    highlights: [
      'LSP servers managed by Mason, completion with nvim-cmp',
      'Telescope and Harpoon for getting around a project',
      'Treesitter, autopairs and autotag for editing',
    ],
    tags: ['Neovim', 'Lua', 'lazy.nvim', 'Catppuccin'],
    sprite: 'moon',
    media: { kind: 'code' },
  },
  macos_dots: {
    tagline: 'Dotfiles for macOS',
    description:
      'The same keyboard-first workflow on a Mac. AeroSpace tiles the windows, Homebrew installs everything from a Brewfile, and the terminal stack matches my Linux machines.',
    highlights: [
      'AeroSpace for tiling, with Ghostty, Kitty and Alacritty configs',
      'Fish, Zsh and tmux, plus Yazi as the file manager',
      'A setup script that handles Homebrew and the Stow symlinks',
    ],
    tags: ['macOS', 'AeroSpace', 'Homebrew', 'Shell'],
    sprite: 'command',
    media: {
      kind: 'image',
      src: macosDots,
      alt: 'Neovim dashboard in a terminal on macOS',
      fit: 'cover',
    },
  },
  'spotify-esp32': {
    tagline: 'Now playing, on a tiny OLED',
    description:
      'A MicroPython project that puts the song I am listening to on a 128×64 I2C display. The ESP32 joins Wi-Fi, asks the Spotify Web API what is playing and draws it.',
    highlights: [
      'Four wires: power, ground and I2C on GPIO 21 and 22',
      'Split into small modules for Wi-Fi, Spotify and the display',
      'Credentials and tokens live in a separate env file',
    ],
    tags: ['ESP32', 'MicroPython', 'OLED', 'Spotify API'],
    sprite: 'oled',
    media: {
      kind: 'image',
      src: spotifyEsp32,
      alt: 'Wiring diagram: an ESP32 board connected to an I2C OLED display',
      fit: 'contain',
      background: '#333333',
    },
  },
}

export interface PinnedProject {
  name: string
  url: string
  tagline?: string
  description: string | null
  highlights: string[]
  language: string | null
  tags: string[]
  since: string
  sprite: SpriteName
  media: Media
}

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'America/Toronto' })

const fetched: GithubPin[] = fetchedPins

/** The repos pinned on my GitHub profile, in the same order: facts from GitHub, writing from the overrides. */
export const pinned: PinnedProject[] = fetched.map((pin) => {
  const override = overrides[pin.name] ?? {}
  return {
    name: pin.name,
    url: pin.url,
    tagline: override.tagline,
    description: override.description ?? pin.description,
    highlights: override.highlights ?? [],
    language: pin.language,
    tags: override.tags ?? pin.topics,
    since: monthYear.format(new Date(pin.createdAt)),
    sprite: override.sprite ?? languageSprite[pin.language ?? ''] ?? 'editor',
    media: override.media ?? previewOf(pin),
  }
})

/** Until a repo gets a screenshot of its own, it shows its GitHub social preview. */
function previewOf(pin: GithubPin): Media {
  if (!pin.image) return { kind: 'placeholder' }
  return {
    kind: 'image',
    src: import.meta.env.BASE_URL + pin.image,
    alt: `GitHub social preview of the ${pin.name} repo`,
    // The preview is wider than the frame, and its text runs close to the edges.
    fit: 'contain',
  }
}

export interface DotfilesNode {
  name: string
  role: string
  note: string
  hue: string
}

/** combined_dots is a git submodule of the three system repos. */
export const dotfiles: { core: DotfilesNode; systems: DotfilesNode[] } = {
  core: {
    name: 'combined_dots',
    role: 'shared core',
    note: 'Neovim, Kitty, Zsh, Starship and Fastfetch configs common to every machine, plus the setup scripts. Pulled into each repo below as a git submodule.',
    hue: 'mauve',
  },
  systems: [
    {
      name: 'linux_dots',
      role: 'Arch and CachyOS',
      note: 'Hyprland with the Caelestia shell, tmux and the rest of my Linux desktop.',
      hue: 'blue',
    },
    {
      name: 'omarchy_dots',
      role: 'Omarchy',
      note: 'Hyprland keybindings, shell plugins and an installer built on the Omarchy CLI. Also pulls in init.lua.',
      hue: 'green',
    },
    {
      name: 'macos_dots',
      role: 'macOS',
      note: 'AeroSpace, Ghostty, Yazi and a Brewfile, so a Mac feels like the others.',
      hue: 'peach',
    },
  ],
}

export interface WipProject {
  name: string
  context: string
  description: string
  tags: string[]
  language: string
}

export const inProgress: WipProject[] = [
  {
    name: 'graph-your-x',
    context: 'HackDécouverte 2026, Concordia University',
    description:
      'Pick something you want to learn and see every prerequisite standing between you and it, including the prerequisites of the prerequisites. Check off what you have done and the graph shows what you can take next.',
    tags: ['React 19', 'TypeScript', 'Vite', 'FastAPI', 'SQLite'],
    language: 'TypeScript',
  },
  {
    name: 'projet_architecture_logiciel',
    context: 'Software architecture class, Cégep Marie-Victorin',
    description:
      'A turn-based fantasy RPG engine exposed as a REST API. The whole point of the class is containing change, so the code is organized around Clean Code, SOLID and domain-driven design, with unit tests.',
    tags: ['Java', 'REST API', 'DDD', 'Maven'],
    language: 'Java',
  },
]

export interface Repo {
  name: string
  description: string
  language: string
  date: string
}

/** Everything else that is public, newest first. */
export const moreRepos: Repo[] = [
  {
    name: 'omarchy-openvpn',
    description: 'Omarchy shell plugin to connect and disconnect OpenVPN profiles from the bar',
    language: 'QML',
    date: 'Oct 2026',
  },
  {
    name: 'combined_dots',
    description: 'Dotfiles common to my Mac and Linux machines',
    language: 'Shell',
    date: 'Aug 2026',
  },
  {
    name: 'Pokedex',
    description: 'A Pokédex with favorites and an item list, built with React and Vite',
    language: 'JavaScript',
    date: 'May 2026',
  },
  {
    name: 'ShadowArena',
    description: 'Terminal RPG inspired by Dungeons & Dragons, my final OOP project',
    language: 'Java',
    date: 'Apr 2026',
  },
  {
    name: 'advent-of-code',
    description: 'The Advent of Code 2025 problems I could solve',
    language: 'Python',
    date: 'Mar 2026',
  },
  {
    name: 'FileConverter',
    description: 'CSV to JSON converter',
    language: 'Python',
    date: 'Mar 2026',
  },
  {
    name: 'rustbook',
    description: 'Learning Rust with the Rust book',
    language: 'Rust',
    date: 'Mar 2026',
  },
  {
    name: 'grrs',
    description: 'A grep clone, written to learn Rust CLI apps',
    language: 'Rust',
    date: 'Mar 2026',
  },
  {
    name: 'wallpapers',
    description: 'All of my wallpapers',
    language: 'Images',
    date: 'Dec 2025',
  },
  {
    name: 'ypsilLang',
    description: 'A small Lisp-like interpreted language with a REPL, written in C',
    language: 'C',
    date: 'Dec 2025',
  },
  {
    name: 'geeSave',
    description: 'Automatic backup script built on rsync, released as a .deb',
    language: 'Shell',
    date: 'Dec 2025',
  },
]
