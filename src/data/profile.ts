import type { SpriteName } from '../pixel/sprites'

export const profile = {
  name: 'German Viter',
  handle: 'GermanViter',
  location: 'Montréal, QC',
  school: 'Cégep Marie-Victorin',
  program: 'DEC in IT',
  semester: 3,
  seeking: 'summer 2027 internship',
  email: 'viter.german@gmail.com',
  github: 'https://github.com/GermanViter',
  /** Typed one after the other after "I am" on the home page. */
  roles: ['an IT student', 'a Linux ricer', 'a terminal dweller'],
} as const

export interface Social {
  id: string
  label: string
  handle: string
  href: string
  sprite: SpriteName
  /** Catppuccin color name used for the icon. */
  hue: string
}

export const socials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@GermanViter',
    href: 'https://github.com/GermanViter',
    sprite: 'github',
    hue: 'mauve',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'German Viter',
    href: 'https://www.linkedin.com/in/german-viter-32b0b6388',
    sprite: 'linkedin',
    hue: 'blue',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@germanovitchh',
    href: 'https://www.instagram.com/germanovitchh',
    sprite: 'instagram',
    hue: 'pink',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    handle: 'viter.german@gmail.com',
    href: 'mailto:viter.german@gmail.com',
    sprite: 'mail',
    hue: 'peach',
  },
]

/** The G from the fastfetch card on my GitHub profile. */
export const fetchLogo = [
  '      #######     ',
  '    ###     ###   ',
  '   ##         ##  ',
  '  ##              ',
  '  ##              ',
  '  ##    ######    ',
  '  ##     ##  ##   ',
  '  ##      #  ##   ',
  '   ##       ###   ',
  '    ###    ###    ',
  '      #######     ',
]

export interface FetchRow {
  key: string
  value: string
}

export const fetchGroups: FetchRow[][] = [
  [
    { key: 'OS', value: 'Omarchy 4.5' },
    { key: 'Uptime', value: '18 yrs' },
    { key: 'Kernel', value: 'IT student' },
    { key: 'IDE', value: 'neovim, intellij and vscode' },
  ],
  [
    { key: 'Languages.Programming', value: 'Python, Java, Lua, QML' },
    { key: 'Languages.Computer', value: 'HTML, CSS, JSON, YAML, Bash, TOML' },
    { key: 'Languages.Real', value: 'English, French, Russian, Spanish' },
  ],
  [
    { key: 'Hobbies.Software', value: 'homelabbing, linux ricing, working with agents' },
    { key: 'Hobbies.Real', value: 'hiking, skiing, heavy metal, chess' },
  ],
]

export interface Trait {
  sprite: SpriteName
  title: string
  body: string
}

export const traits: Trait[] = [
  {
    sprite: 'terminal',
    title: 'I live in the terminal',
    body: 'Zsh, tmux, Kitty and a Starship prompt. If a job can be done from a shell, that is where I do it.',
  },
  {
    sprite: 'tiles',
    title: 'I rice Linux for fun',
    body: 'Hyprland, tiled windows, matching colors down to the fetch output. Omarchy and CachyOS are my favorite distros, and I keep a dotfiles repo for every system I use.',
  },
  {
    sprite: 'editor',
    title: 'Neovim is home',
    body: 'My favorite editor by a wide margin. My dotfiles ship a LazyVim setup, and I also keep a config written from scratch in init.lua. IntelliJ and VS Code are in the rotation too.',
  },
  {
    sprite: 'mountain',
    title: 'Away from the keyboard',
    body: 'Hiking, skiing, chess and heavy metal. I also run a small homelab, which technically still counts as being near a keyboard.',
  },
]

export interface ToolGroup {
  dir: string
  hue: string
  items: string[]
}

export const toolbox: ToolGroup[] = [
  { dir: 'languages', hue: 'mauve', items: ['Python', 'Java', 'JavaScript', 'Rust', 'Lua', 'Bash'] },
  { dir: 'web', hue: 'blue', items: ['React', 'Vite', 'Node.js'] },
  { dir: 'systems', hue: 'green', items: ['Linux', 'Docker', 'MySQL'] },
  { dir: 'hardware', hue: 'peach', items: ['Arduino', 'Raspberry Pi', 'ESP32'] },
  { dir: 'editors', hue: 'yellow', items: ['Neovim', 'IntelliJ', 'VS Code'] },
]
