import { useCallback, useLayoutEffect, useState } from 'react'
import { DEFAULT_THEME, THEMES, type ThemeId } from '../data/themes'

const STORAGE_KEY = 'theme'
/** The key used back when the site only had Catppuccin flavors. */
const LEGACY_KEY = 'flavor'

function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value)
}

function readStored(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY)
    if (isThemeId(stored)) return stored
  } catch {
    // Storage can be unavailable (private mode); the default still applies.
  }
  return DEFAULT_THEME
}

/** The active theme, mirrored on <html data-theme> and persisted. */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(readStored)

  // A layout effect, so the attribute is in place before any child effect
  // (the pixel field) reads the theme's colors back from CSS.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Not persisted, which is fine.
    }
    const base = getComputedStyle(document.documentElement).getPropertyValue('--base').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', base)
  }, [theme])

  const cycle = useCallback(() => {
    setTheme((current) => {
      const index = THEMES.findIndex((candidate) => candidate.id === current)
      return THEMES[(index + 1) % THEMES.length].id
    })
  }, [])

  return { theme, setTheme, cycle }
}
