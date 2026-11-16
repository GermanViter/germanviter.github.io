import { useEffect, useRef } from 'react'
import './pixel.css'

const PITCH = 20
const SQUARE = 10
const HUES = ['--mauve', '--blue', '--lavender'] as const
const ALPHAS = [0.1, 0.16, 0.26]
const TICK_MS = 140

interface Cell {
  x: number
  y: number
  /** Chance that this cell is lit at any moment. */
  chance: number
  hue: number
  alpha: number
  on: boolean
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Smooth-ish value noise so the squares gather in drifts instead of static. */
function drift(col: number, row: number): number {
  const n = Math.sin(Math.floor(col / 5) * 12.9898 + Math.floor(row / 5) * 78.233) * 43758.5453
  return n - Math.floor(n)
}

/** Width of the centered content column and its gutter; mirrors --page and --gutter. */
const PAGE = 1120
const gutterFor = (width: number) => Math.min(Math.max(16, width * 0.04), 32)

function buildCells(width: number, height: number): Cell[] {
  const random = mulberry32(8080)
  const cells: Cell[] = []
  const columns = Math.ceil(width / PITCH)
  const rows = Math.ceil(height / PITCH)

  // Squares are dense in the empty margin beside the content column, then
  // spill a short way under it at the faintest level so text stays readable.
  const margin = Math.max(0, (width - PAGE) / 2 - gutterFor(width)) + gutterFor(width)
  const spill = Math.min(160, width * 0.2)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const roll = random()
      const hue = Math.floor(random() * HUES.length)
      const level = Math.floor(random() * ALPHAS.length)

      const center = col * PITCH + PITCH / 2
      const fromEdge = Math.min(center, width - center)
      const inMargin = fromEdge < margin
      if (!inMargin && fromEdge > margin + spill) continue

      const pull = inMargin
        ? 0.5 * (1 - (fromEdge / margin) * 0.5)
        : 0.16 * (1 - (fromEdge - margin) / spill) ** 1.5
      const chance = pull * (0.3 + drift(col, row) * 1.2)
      if (chance < 0.012) continue

      cells.push({
        x: col * PITCH + (PITCH - SQUARE) / 2,
        y: row * PITCH + (PITCH - SQUARE) / 2,
        chance,
        hue,
        alpha: inMargin ? ALPHAS[level] : ALPHAS[0] * 0.8,
        on: roll < chance,
      })
    }
  }
  return cells
}

/**
 * The dithered square field behind every page, thickest at the screen edges.
 * `flavor` is only a redraw trigger: the colors are read from the CSS variables.
 */
export function PixelField({ flavor }: { flavor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cells: Cell[] = []
    let colors: string[] = []
    let timer: number | undefined

    const paint = (cell: Cell) => {
      context.clearRect(cell.x, cell.y, SQUARE, SQUARE)
      if (!cell.on) return
      context.globalAlpha = cell.alpha
      context.fillStyle = colors[cell.hue]
      context.fillRect(cell.x, cell.y, SQUARE, SQUARE)
    }

    const draw = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const styles = getComputedStyle(document.documentElement)
      colors = HUES.map((hue) => styles.getPropertyValue(hue).trim())
      cells = buildCells(width, height)
      cells.forEach(paint)
    }

    const twinkle = () => {
      if (document.hidden || cells.length === 0) return
      const flips = Math.max(2, Math.round(cells.length / 90))
      for (let i = 0; i < flips; i++) {
        const cell = cells[Math.floor(Math.random() * cells.length)]
        cell.on = Math.random() < cell.chance
        paint(cell)
      }
    }

    const start = () => {
      window.clearInterval(timer)
      if (!reducedMotion.matches) timer = window.setInterval(twinkle, TICK_MS)
    }

    draw()
    start()
    window.addEventListener('resize', draw)
    reducedMotion.addEventListener('change', start)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('resize', draw)
      reducedMotion.removeEventListener('change', start)
    }
  }, [flavor])

  return <canvas ref={canvasRef} className="pixel-field" aria-hidden="true" />
}
