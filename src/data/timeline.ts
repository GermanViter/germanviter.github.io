export interface Commit {
  /** Fake short hash, purely decorative. */
  hash: string
  date: string
  title: string
  body: string
  repos?: string[]
  /** Marks the entry the HEAD pointer sits on. */
  head?: boolean
}

/** My history as a developer, oldest first, reconstructed from my GitHub repos. */
export const timeline: Commit[] = [
  {
    hash: 'a1c0de5',
    date: 'Aug 2025',
    title: 'init: start the DEC in IT',
    body: 'First semester at Cégep Marie-Victorin in Montréal. I opened my GitHub account that same month.',
  },
  {
    hash: 'b7e11a2',
    date: 'Nov 2025',
    title: 'feat: first dotfiles',
    body: 'My first repo was not a school project but my Hyprland and Caelestia shell config. The ricing habit starts here and never really stops.',
    repos: ['linux_dots'],
  },
  {
    hash: 'c3f9d04',
    date: 'Dec 2025',
    title: 'feat: a winter break of side projects',
    body: 'A Bash backup tool I shipped as a .deb package, a small Lisp-like interpreter in C, and a Snake game in Python. Three languages in ten days.',
    repos: ['geeSave', 'ypsilLang', 'snakeGame'],
  },
  {
    hash: 'd58a6b1',
    date: 'Mar 2026',
    title: 'feat: pick up Rust',
    body: 'Worked through the Rust book and wrote a grep clone to learn how CLI apps are built. Same month: my Advent of Code 2025 solutions and a CSV to JSON converter in Python.',
    repos: ['rustbook', 'grrs', 'advent-of-code', 'FileConverter'],
  },
  {
    hash: 'e02c7f9',
    date: 'Apr 2026',
    title: 'feat: ShadowArena',
    body: 'Final project for my object-oriented programming class: a Dungeons & Dragons inspired terminal RPG in Java, with classes, monsters, items and a save system.',
    repos: ['ShadowArena'],
  },
  {
    hash: 'f4416ce',
    date: 'May 2026',
    title: 'refactor: Neovim, from scratch',
    body: 'Wrote my own init.lua from scratch: lazy.nvim, LSP through Mason, completion, Telescope, Treesitter and Harpoon. I also built a Pokédex in React that month.',
    repos: ['init.lua', 'Pokedex'],
  },
  {
    hash: '09ab3d7',
    date: 'Jun – Aug 2026',
    title: 'feat: dotfiles for every machine',
    body: 'One config was not enough anymore. A macOS repo in June, a shared core in August, then a repo for Omarchy.',
    repos: ['macos_dots', 'combined_dots', 'omarchy_dots'],
  },
  {
    hash: '1d7e52b',
    date: 'Sep 2026',
    title: 'feat: third semester, software architecture',
    body: 'A turn-based RPG engine exposed as a REST API in Java, built in class around Clean Code, SOLID and domain-driven design.',
    repos: ['projet_architecture_logiciel'],
  },
  {
    hash: '2f80c6a',
    date: 'Oct 2026',
    title: 'feat: a plugin and some hardware',
    body: 'Wrote an OpenVPN plugin for the Omarchy shell in QML, then wired an ESP32 to an OLED screen to show what I am listening to on Spotify.',
    repos: ['omarchy-openvpn', 'spotify-esp32'],
  },
  {
    hash: '3e91f0d',
    date: 'Nov 2026',
    title: 'feat: hackathon at Concordia',
    body: 'Built graph-your-x for HackDécouverte at Concordia University: a tool that maps every prerequisite between you and the subject you want to learn.',
    repos: ['graph-your-x'],
    head: true,
  },
]
