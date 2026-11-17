import { useMemo } from 'react'
import './pixel.css'

export interface PieSlice {
  name: string
  /** Fraction of the whole; the slices should add up to 1. */
  share: number
  /** Any CSS color. */
  color: string
}

interface PixelPieProps {
  slices: readonly PieSlice[]
  /** Pixels across the pie. */
  resolution?: number
  /** Name of the slice to bring forward; the others fade. */
  active?: string | null
  onHover?: (name: string | null) => void
  className?: string
}

interface Run {
  x: number
  y: number
  length: number
}

/**
 * A pie chart drawn on a pixel grid, with a dark outline and the same drop
 * shadow as PixelText. Each pixel takes the slice its center falls in,
 * starting at 12 o'clock and going clockwise. Decorative: pair it with a legend.
 */
export function PixelPie({ slices, resolution = 32, active = null, onHover, className }: PixelPieProps) {
  const { fills, outline } = useMemo(() => {
    const radius = resolution / 2
    const inside = (x: number, y: number) => {
      const dx = x + 0.5 - radius
      const dy = y + 0.5 - radius
      return dx * dx + dy * dy <= radius * radius
    }

    // Where each slice ends, going round from 0 to 1.
    let sum = 0
    const ends = slices.map((slice) => (sum += slice.share))
    const sliceAt = (x: number, y: number) => {
      const angle = Math.atan2(x + 0.5 - radius, radius - (y + 0.5))
      const turn = (angle < 0 ? angle + 2 * Math.PI : angle) / (2 * Math.PI)
      const index = ends.findIndex((end) => turn < end)
      return index === -1 ? slices.length - 1 : index
    }

    const fills: Run[][] = slices.map(() => [])
    const outline: Run[] = []
    for (let y = 0; y < resolution; y++) {
      let x = 0
      while (x < resolution) {
        // Classify the pixel: outside, on the edge, or in a slice.
        const kind = (px: number) =>
          !inside(px, y)
            ? -2
            : !inside(px - 1, y) || !inside(px + 1, y) || !inside(px, y - 1) || !inside(px, y + 1)
              ? -1
              : sliceAt(px, y)
        const key = kind(x)
        let end = x + 1
        while (end < resolution && kind(end) === key) end++
        if (key === -1) outline.push({ x, y, length: end - x })
        else if (key >= 0) fills[key].push({ x, y, length: end - x })
        x = end
      }
    }
    return { fills, outline }
  }, [slices, resolution])

  const size = resolution + 1

  return (
    <svg
      className={['pixel-pie', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      onMouseLeave={onHover && (() => onHover(null))}
    >
      <g className="pixel-pie__shadow">
        {outline.map((run) => (
          <rect key={`${run.x}-${run.y}`} x={run.x + 1} y={run.y + 1} width={run.length} height="1" />
        ))}
        {fills.flat().map((run) => (
          <rect key={`${run.x}-${run.y}`} x={run.x + 1} y={run.y + 1} width={run.length} height="1" />
        ))}
      </g>
      {slices.map((slice, index) => (
        <g
          key={slice.name}
          className="pixel-pie__slice"
          fill={slice.color}
          data-dim={active !== null && active !== slice.name ? '' : undefined}
          onMouseEnter={onHover && (() => onHover(slice.name))}
        >
          {fills[index].map((run) => (
            <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.length} height="1" />
          ))}
        </g>
      ))}
      <g className="pixel-pie__outline">
        {outline.map((run) => (
          <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.length} height="1" />
        ))}
      </g>
    </svg>
  )
}
