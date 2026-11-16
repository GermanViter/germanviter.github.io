export interface Theme {
  /** Value of <html data-theme>; must match a block in styles/theme.css. */
  id: string
  family: string
  name: string
  /** Preview colors for the picker: background, accent, then two more hues. */
  swatch: readonly [string, string, string, string]
}

/** Every theme the site can wear, in the order `t` cycles through them. */
export const THEMES = [
  { id: 'mocha', family: 'Catppuccin', name: 'Mocha', swatch: ['#1e1e2e', '#cba6f7', '#89b4fa', '#a6e3a1'] },
  { id: 'macchiato', family: 'Catppuccin', name: 'Macchiato', swatch: ['#24273a', '#c6a0f6', '#8aadf4', '#a6da95'] },
  { id: 'frappe', family: 'Catppuccin', name: 'Frappé', swatch: ['#303446', '#ca9ee6', '#8caaee', '#a6d189'] },
  { id: 'latte', family: 'Catppuccin', name: 'Latte', swatch: ['#eff1f5', '#8839ef', '#1e66f5', '#40a02b'] },
  { id: 'gruvbox-dark', family: 'Gruvbox', name: 'Dark', swatch: ['#282828', '#fe8019', '#fabd2f', '#b8bb26'] },
  { id: 'gruvbox-light', family: 'Gruvbox', name: 'Light', swatch: ['#fbf1c7', '#af3a03', '#b57614', '#79740e'] },
  { id: 'tokyo-night', family: 'Tokyo Night', name: 'Night', swatch: ['#1a1b26', '#7aa2f7', '#bb9af7', '#9ece6a'] },
] as const satisfies readonly Theme[]

export type ThemeId = (typeof THEMES)[number]['id']

export const DEFAULT_THEME: ThemeId = 'mocha'

/** "Catppuccin Mocha", "Gruvbox Dark", but just "Tokyo Night". */
export function themeLabel(theme: Theme): string {
  return theme.family.endsWith(theme.name) ? theme.family : `${theme.family} ${theme.name}`
}

export function findTheme(id: ThemeId): Theme {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0]
}
