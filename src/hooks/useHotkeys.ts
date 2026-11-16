import { useEffect, useRef } from 'react'

type Bindings = Record<string, () => void>

/** Single-key shortcuts, ignored while typing or when a modifier is held. */
export function useHotkeys(bindings: Bindings) {
  const latest = useRef(bindings)

  useEffect(() => {
    latest.current = bindings
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      const action = latest.current[event.key.toLowerCase()]
      if (action) {
        event.preventDefault()
        action()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
