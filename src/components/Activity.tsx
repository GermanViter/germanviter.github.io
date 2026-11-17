import { useState } from 'react'
import { contributions, formatDay, languageRepos, languages, months, stats } from '../data/activity'
import type { ContributionDay } from '../data/github-activity'
import { PixelPie } from '../pixel/PixelPie'
import './Activity.css'

const number = new Intl.NumberFormat('en-US')
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 })

const plural = (count: number, word: string) => `${number.format(count)} ${word}${count === 1 ? '' : 's'}`

/* The graph is laid out in SVG units: one cell, plus the gap after it. */
const CELL = 10
const STEP = 13
const LEFT = 30
const TOP = 18

const DAY_LABELS = [
  { row: 1, label: 'Mon' },
  { row: 3, label: 'Wed' },
  { row: 5, label: 'Fri' },
]

function describe(day: ContributionDay) {
  return `${plural(day.count, 'contribution')} on ${formatDay(day.date)}`
}

function ContributionGraph() {
  const [hovered, setHovered] = useState<ContributionDay | null>(null)
  const { weeks, total } = contributions

  const width = LEFT + weeks.length * STEP
  const height = TOP + 7 * STEP

  return (
    <div className="window activity__graph">
      <div className="window__bar">
        <span className="window__title">~/contributions</span>
        <span className="window__meta">last 12 months</span>
      </div>
      <div className="window__body">
        <div className="calendar">
          <svg
            className="calendar__svg"
            viewBox={`0 0 ${width} ${height}`}
            shapeRendering="crispEdges"
            role="img"
            aria-label={`Contribution graph: ${plural(total, 'contribution')} on GitHub in the last year`}
            onMouseLeave={() => setHovered(null)}
          >
            {months.map((month) => (
              <text className="calendar__label" key={month.week} x={LEFT + month.week * STEP} y={TOP - 7}>
                {month.label}
              </text>
            ))}
            {DAY_LABELS.map((day) => (
              <text className="calendar__label" key={day.row} x={0} y={TOP + day.row * STEP + CELL - 1}>
                {day.label}
              </text>
            ))}
            {weeks.map((week, column) =>
              week.map((day) => (
                <rect
                  key={day.date}
                  className={`calendar__day calendar__day--${day.level}`}
                  data-active={hovered?.date === day.date ? '' : undefined}
                  x={LEFT + column * STEP}
                  y={TOP + new Date(`${day.date}T00:00:00Z`).getUTCDay() * STEP}
                  width={CELL}
                  height={CELL}
                  onMouseEnter={() => setHovered(day)}
                >
                  <title>{describe(day)}</title>
                </rect>
              )),
            )}
          </svg>
        </div>

        <div className="calendar__foot">
          <p className="calendar__readout" aria-live="polite">
            <span className="calendar__char" aria-hidden="true">
              ❯
            </span>
            {hovered ? describe(hovered) : `${plural(total, 'contribution')} in the last year`}
          </p>
          <p className="calendar__legend" aria-hidden="true">
            less
            {[0, 1, 2, 3, 4].map((level) => (
              <svg key={level} viewBox={`0 0 ${CELL} ${CELL}`} className="calendar__swatch" shapeRendering="crispEdges">
                <rect width={CELL} height={CELL} className={`calendar__day calendar__day--${level}`} />
              </svg>
            ))}
            more
          </p>
        </div>
      </div>
    </div>
  )
}

function Languages() {
  const [active, setActive] = useState<string | null>(null)
  const slices = languages.map((language) => ({ ...language, color: `var(--${language.hue})` }))

  return (
    <div className="window activity__languages">
      <div className="window__bar">
        <span className="window__title">~/languages</span>
        <span className="window__meta">{plural(languageRepos, 'repo')}</span>
      </div>
      <div className="window__body languages">
        <PixelPie className="languages__pie" slices={slices} active={active} onHover={setActive} />
        <ul className="languages__legend" aria-label="Languages by share of code in my public repos">
          {slices.map((slice) => (
            <li
              key={slice.name}
              className="languages__item"
              data-dim={active !== null && active !== slice.name ? '' : undefined}
              onMouseEnter={() => setActive(slice.name)}
              onMouseLeave={() => setActive(null)}
              style={{ '--hue': slice.color } as React.CSSProperties}
            >
              <span className="dot" aria-hidden="true" />
              <span className="languages__name">{slice.name}</span>
              <span className="languages__share">{percent.format(slice.share)}</span>
              <span className="languages__bar" aria-hidden="true">
                <span style={{ width: `${(slice.share / slices[0].share) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** The numbers behind the graph, laid out like the fastfetch output on the home page. */
function Stats() {
  const rows: { key: string; value: string }[] = [
    { key: 'contributions', value: number.format(contributions.total) },
    { key: 'days.active', value: `${number.format(stats.activeDays)} of ${number.format(stats.days)}` },
    { key: 'streak.longest', value: plural(stats.longestStreak, 'day') },
    { key: 'streak.current', value: plural(stats.currentStreak, 'day') },
  ]
  if (stats.busiest && stats.busiest.count > 0) {
    rows.push({ key: 'days.best', value: `${stats.busiest.count} on ${formatDay(stats.busiest.date)}` })
  }
  if (languages[0]) rows.push({ key: 'language.top', value: languages[0].name })

  return (
    <div className="window activity__stats">
      <div className="window__bar">
        <span className="window__title">kitty: ~</span>
        <span className="window__meta">zsh</span>
      </div>
      <div className="window__body">
        <p className="prompt" aria-hidden="true">
          <span className="prompt__dir">~</span>
          <span className="prompt__char">❯</span>
          <span className="prompt__cmd">fastfetch --github</span>
        </p>
        <p className="ghfetch__host">
          <span className="ghfetch__user">germanv</span>
          <span className="ghfetch__at">@</span>
          <span className="ghfetch__user">github</span>
        </p>
        <dl className="ghfetch">
          {rows.map((row) => {
            const [head, tail] = row.key.split('.')
            return (
              <div className="ghfetch__row" key={row.key}>
                <dt>
                  {head}
                  {tail && (
                    <>
                      <span className="ghfetch__key-dot">.</span>
                      <span className="ghfetch__key-tail">{tail}</span>
                    </>
                  )}
                </dt>
                <dd>{row.value}</dd>
              </div>
            )
          })}
        </dl>
        <p className="ghfetch__swatches" aria-hidden="true">
          {['red', 'peach', 'yellow', 'green', 'teal', 'blue', 'mauve', 'pink'].map((hue) => (
            <span key={hue} style={{ background: `var(--${hue})` }} />
          ))}
        </p>
      </div>
    </div>
  )
}

/** My GitHub profile's contribution graph, the languages I write, and the numbers behind them. */
export function Activity() {
  return (
    <div className="activity">
      <ContributionGraph />
      <Languages />
      <Stats />
    </div>
  )
}
