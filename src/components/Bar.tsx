import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FLAVOR_LABEL, type Flavor } from '../hooks/useFlavor'
import { WORKSPACES } from '../data/nav'
import { profile } from '../data/profile'
import { PixelText } from '../pixel/PixelText'
import { Sprite } from '../pixel/Sprite'
import './Bar.css'

const clockFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <time className="bar__clock" dateTime={now.toISOString()} title="Local time in Montréal">
      {clockFormat.format(now).replace(',', '')} <span className="bar__clock-zone">Montréal</span>
    </time>
  )
}

interface BarProps {
  flavor: Flavor
  onCycleFlavor: () => void
}

/** The top bar, laid out like a Hyprland status bar: workspaces, clock, tray. */
export function Bar({ flavor, onCycleFlavor }: BarProps) {
  return (
    <header className="bar">
      <div className="bar__inner">
        <Link to="/" className="bar__logo" aria-label="German Viter, home">
          <PixelText text="GV" />
        </Link>

        <nav className="bar__nav" aria-label="Main">
          {WORKSPACES.map((workspace) => (
            <NavLink
              key={workspace.to}
              to={workspace.to}
              end={workspace.to === '/'}
              className={({ isActive }) => `bar__link${isActive ? ' is-active' : ''}`}
            >
              <span className="bar__link-key" aria-hidden="true">
                {workspace.key}
              </span>
              {workspace.label}
            </NavLink>
          ))}
        </nav>

        <Clock />

        <div className="bar__tray">
          <button
            type="button"
            className="bar__flavor"
            onClick={onCycleFlavor}
            aria-label={`Catppuccin flavor: ${FLAVOR_LABEL[flavor]}. Switch flavor`}
            title="Switch Catppuccin flavor (t)"
          >
            <span className="bar__swatch" aria-hidden="true">
              <i style={{ background: 'var(--mauve)' }} />
              <i style={{ background: 'var(--blue)' }} />
              <i style={{ background: 'var(--green)' }} />
              <i style={{ background: 'var(--peach)' }} />
            </span>
            <span className="bar__flavor-name">{FLAVOR_LABEL[flavor].toLowerCase()}</span>
          </button>
          <a
            className="bar__icon"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
          >
            <Sprite name="github" size={18} />
          </a>
          <a className="btn btn--primary bar__cta" href={`mailto:${profile.email}`}>
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}
