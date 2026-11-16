import { useEffect, useId, useRef, useState } from 'react'
import { findTheme, themeLabel, THEMES, type ThemeId } from '../data/themes'
import './ThemeMenu.css'

interface ThemeMenuProps {
  theme: ThemeId
  onSelect: (theme: ThemeId) => void
}

const FAMILIES = [...new Set(THEMES.map((theme) => theme.family))]

/** The theme picker in the bar: a button that opens a list of every theme. */
export function ThemeMenu({ theme, onSelect }: ThemeMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const current = findTheme(theme)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Arrow keys walk the options, like a native menu.
  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')]
    const index = options.indexOf(document.activeElement as HTMLButtonElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    options[(index + step + options.length) % options.length]?.focus()
  }

  return (
    <div className="theme-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="theme-menu__button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Theme: ${themeLabel(current)}. Change theme`}
        title="Change theme (t for the next one)"
      >
        <span className="theme-menu__swatch" aria-hidden="true">
          <i style={{ background: 'var(--accent)' }} />
          <i style={{ background: 'var(--blue)' }} />
          <i style={{ background: 'var(--green)' }} />
          <i style={{ background: 'var(--yellow)' }} />
        </span>
        <span className="theme-menu__name">{themeLabel(current).toLowerCase()}</span>
      </button>

      {open && (
        <div className="theme-menu__panel" id={panelId} onKeyDown={onPanelKeyDown}>
          {FAMILIES.map((family) => (
            <div className="theme-menu__group" role="group" aria-label={family} key={family}>
              <p className="theme-menu__family" aria-hidden="true">
                {family}
              </p>
              {THEMES.filter((option) => option.family === family).map((option) => (
                <button
                  type="button"
                  className="theme-menu__option"
                  key={option.id}
                  aria-pressed={option.id === theme}
                  onClick={() => onSelect(option.id)}
                >
                  <span className="theme-menu__preview" aria-hidden="true" style={{ background: option.swatch[0] }}>
                    {option.swatch.slice(1).map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <span className="sr-only">{family} </span>
                  {option.name}
                  <span className="theme-menu__check" aria-hidden="true">
                    {option.id === theme ? '●' : ''}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
