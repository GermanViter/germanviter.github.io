import { useCallback, useEffect, useState } from 'react'

export const FLAVORS = ['mocha', 'macchiato', 'frappe', 'latte'] as const
export type Flavor = (typeof FLAVORS)[number]

export const FLAVOR_LABEL: Record<Flavor, string> = {
  mocha: 'Mocha',
  macchiato: 'Macchiato',
  frappe: 'Frappé',
  latte: 'Latte',
}

const STORAGE_KEY = 'flavor'

function isFlavor(value: unknown): value is Flavor {
  return FLAVORS.includes(value as Flavor)
}

function readStored(): Flavor {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isFlavor(stored)) return stored
  } catch {
    // Storage can be unavailable (private mode); the default still applies.
  }
  return 'mocha'
}

/** The active Catppuccin flavor, mirrored on <html data-flavor> and persisted. */
export function useFlavor() {
  const [flavor, setFlavor] = useState<Flavor>(readStored)

  useEffect(() => {
    document.documentElement.dataset.flavor = flavor
    try {
      localStorage.setItem(STORAGE_KEY, flavor)
    } catch {
      // Not persisted, which is fine.
    }
    const base = getComputedStyle(document.documentElement).getPropertyValue('--base').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', base)
  }, [flavor])

  const cycle = useCallback(() => {
    setFlavor((current) => FLAVORS[(FLAVORS.indexOf(current) + 1) % FLAVORS.length])
  }, [])

  return { flavor, cycle }
}
