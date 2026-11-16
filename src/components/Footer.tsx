import { socials } from '../data/profile'
import './Footer.css'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__keys">
          <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> switch workspace
          <span className="footer__sep" aria-hidden="true">
            ·
          </span>
          <kbd>t</kbd> next theme
        </p>

        <ul className="footer__links">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                className="footer__link"
                href={social.href}
                {...(social.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
              >
                {social.label.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>

        <p className="footer__note">
          © {YEAR} German Viter. Built with TypeScript, Vite and React. Look inspired by{' '}
          <a className="footer__link" href="https://omarchy.org" target="_blank" rel="noreferrer">
            Omarchy
          </a>
          , themes by Catppuccin, Gruvbox and Tokyo Night.
        </p>
      </div>
    </footer>
  )
}
