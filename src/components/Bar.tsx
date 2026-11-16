import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { WORKSPACES } from '../data/nav'
import { profile } from '../data/profile'
import type { ThemeId } from '../data/themes'
import { PixelText } from '../pixel/PixelText'
import { Sprite } from '../pixel/Sprite'
import { ThemeMenu } from './ThemeMenu'
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
  theme: ThemeId
  onSelectTheme: (theme: ThemeId) => void
}

/** The top bar, laid out like a Hyprland status bar: workspaces, clock, tray. */
export function Bar({ theme, onSelectTheme }: BarProps) {
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
          <ThemeMenu theme={theme} onSelect={onSelectTheme} />
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
