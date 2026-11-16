import { socials } from '../data/profile'
import { Sprite } from '../pixel/Sprite'
import './Socials.css'

/** Link tiles for GitHub, LinkedIn, Instagram and Gmail. */
export function Socials() {
  return (
    <ul className="socials">
      {socials.map((social) => {
        const external = !social.href.startsWith('mailto:')
        return (
          <li key={social.id}>
            <a
              className="social"
              href={social.href}
              style={{ '--hue': `var(--${social.hue})` } as React.CSSProperties}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="social__icon">
                <Sprite name={social.sprite} size={36} />
              </span>
              <span className="social__text">
                <span className="social__label">{social.label}</span>
                <span className="social__handle">{social.handle}</span>
              </span>
              <span className="social__arrow" aria-hidden="true">
                {external ? '↗' : '→'}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
