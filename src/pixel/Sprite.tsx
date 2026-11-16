import { useMemo } from 'react'
import { PALETTE, SPRITES, type SpriteName } from './sprites'
import './pixel.css'

interface SpriteProps {
  name: SpriteName
  /** Rendered edge length in CSS pixels. */
  size?: number
  className?: string
}

interface Run {
  x: number
  y: number
  length: number
  fill: string
}

/** Merge horizontal neighbours of the same color into one rect. */
function toRuns(rows: readonly string[]): Run[] {
  const runs: Run[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const key = row[x]
      let end = x + 1
      while (end < row.length && row[end] === key) end++
      const fill = PALETTE[key]
      if (fill) runs.push({ x, y, length: end - x, fill })
      x = end
    }
  })
  return runs
}

/** A piece of pixel art. Decorative, so it is hidden from assistive tech. */
export function Sprite({ name, size = 48, className }: SpriteProps) {
  const rows = SPRITES[name]
  const runs = useMemo(() => toRuns(rows), [rows])
  const columns = rows[0].length

  return (
    <svg
      className={['sprite', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${columns} ${rows.length}`}
      width={size}
      height={(size / columns) * rows.length}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {runs.map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.length} height="1" fill={run.fill} />
      ))}
    </svg>
  )
}
