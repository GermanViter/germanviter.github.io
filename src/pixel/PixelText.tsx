import { useMemo } from 'react'
import { layoutText } from './font'
import './pixel.css'

interface PixelTextProps {
  text: string
  /** Draw an offset copy underneath, one pixel down and to the right. */
  shadow?: boolean
  /** Gap between glyphs, in pixels. */
  tracking?: number
  /** Dither the pixels in on mount. */
  animate?: boolean
  className?: string
}

/** Stable pseudo-random value in [0, 1) for a pixel, so renders stay pure. */
function scatter(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

/**
 * Text drawn pixel by pixel from the bitmap font.
 * Size it with the `--px` custom property (the edge of one pixel).
 * Decorative: pair it with real text for screen readers.
 */
export function PixelText({ text, shadow = false, tracking = 1, animate = false, className }: PixelTextProps) {
  const layout = useMemo(() => layoutText(text, tracking), [text, tracking])
  const pad = shadow ? 1 : 0
  const width = layout.width + pad
  const height = layout.height + pad

  return (
    <svg
      className={['pixel-text', animate && 'pixel-text--animate', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${width} ${height}`}
      style={{ aspectRatio: `${width} / ${height}`, '--rows': height } as React.CSSProperties}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {shadow && (
        <g className="pixel-text__shadow">
          {layout.pixels.map(({ x, y }) => (
            <rect
              key={`${x}-${y}`}
              x={x + 1}
              y={y + 1}
              width="1"
              height="1"
              style={animate ? { animationDelay: `${120 + scatter(x, y) * 900}ms` } : undefined}
            />
          ))}
        </g>
      )}
      <g className="pixel-text__face">
        {layout.pixels.map(({ x, y }) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1"
            height="1"
            style={animate ? { animationDelay: `${scatter(x, y) * 900}ms` } : undefined}
          />
        ))}
      </g>
    </svg>
  )
}
