import { useEffect, useState } from 'react'

/** Delay before the first letter of each word. */
const START_MS = 500
const TYPE_MS = 80
/** How long a finished word stays on screen. */
const HOLD_MS = 2000
const DELETE_MS = 40

interface Typewriter {
  /** The whole current word, to size its space before it is typed out. */
  word: string
  /** The part of the current word typed so far. */
  text: string
  /** True while letters are going in or out, so the cursor can stop blinking. */
  busy: boolean
}

/**
 * Types each word, holds it, deletes it, then moves on to the next, forever.
 * Returns null when the visitor prefers reduced motion: show the words statically instead.
 */
export function useTypewriter(words: readonly string[]): Typewriter | null {
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const word = words[index]

  useEffect(() => {
    if (reducedMotion) return

    let delay: number
    let step: () => void
    if (!deleting && length < word.length) {
      delay = length === 0 ? START_MS : TYPE_MS
      step = () => setLength(length + 1)
    } else if (!deleting) {
      delay = HOLD_MS
      step = () => setDeleting(true)
    } else if (length > 0) {
      delay = DELETE_MS
      step = () => setLength(length - 1)
    } else {
      delay = 0
      step = () => {
        setDeleting(false)
        setIndex((index + 1) % words.length)
      }
    }

    const timer = window.setTimeout(step, delay)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, word, words.length, index, length, deleting])

  if (reducedMotion) return null
  return {
    word,
    text: word.slice(0, length),
    busy: length > 0 && (deleting || length < word.length),
  }
}
