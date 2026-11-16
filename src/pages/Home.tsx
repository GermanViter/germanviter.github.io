import { Link } from 'react-router-dom'
import { SectionHead } from '../components/SectionHead'
import { Socials } from '../components/Socials'
import { fetchGroups, fetchLogo, profile, toolbox, traits } from '../data/profile'
import { repoUrl } from '../data/projects'
import { timeline } from '../data/timeline'
import { PixelText } from '../pixel/PixelText'
import { Sprite } from '../pixel/Sprite'
import './Home.css'

const SWATCHES = ['red', 'peach', 'yellow', 'green', 'teal', 'blue', 'mauve', 'pink']

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <a className="hero__pill" href={`mailto:${profile.email}`}>
        <span className="dot hero__pill-dot" aria-hidden="true" />
        Open to a {profile.seeking}
        <span aria-hidden="true">→</span>
      </a>

      <h1 className="hero__title" id="hero-title">
        <span className="sr-only">{profile.name}</span>
        <PixelText text="GERMAN" shadow tracking={2} animate />
        <PixelText text="VITER" shadow tracking={2} animate />
      </h1>

      <p className="hero__tagline">
        IT student, Linux ricer, terminal dweller
        <span className="hero__cursor" aria-hidden="true" />
      </p>
      <p className="hero__lead">
        I study IT at {profile.school} in Montréal, third semester of the DEC. Most of what I build starts in a
        terminal and ends up in a dotfiles repo.
      </p>

      <div className="hero__actions">
        <Link className="btn btn--primary" to="/projects">
          See my projects
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </Link>
        <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
          <Sprite name="github" size={16} />
          GitHub
        </a>
      </div>
    </section>
  )
}

function Fetch() {
  return (
    <section className="fetch window" aria-label="Profile summary, styled as fastfetch output">
      <div className="window__bar">
        <span className="window__title">kitty: ~</span>
        <span className="window__meta">zsh</span>
      </div>
      <div className="window__body fetch__body">
        <p className="prompt" aria-hidden="true">
          <span className="prompt__dir">~</span>
          <span className="prompt__char">❯</span>
          <span className="prompt__cmd">fastfetch</span>
        </p>
        <div className="fetch__grid">
          <pre className="fetch__logo" aria-hidden="true">
            {fetchLogo.join('\n')}
          </pre>
          <div className="fetch__info">
            <p className="fetch__host">
              <span className="fetch__user">germanv</span>
              <span className="fetch__at">@</span>
              <span className="fetch__user">8080</span>
            </p>
            {fetchGroups.map((group) => (
              <dl className="fetch__group" key={group[0].key}>
                {group.map((row) => {
                  const [head, tail] = row.key.split('.')
                  return (
                    <div className="fetch__row" key={row.key}>
                      <dt>
                        {head}
                        {tail && (
                          <>
                            <span className="fetch__key-dot">.</span>
                            <span className="fetch__key-tail">{tail}</span>
                          </>
                        )}
                      </dt>
                      <dd>{row.value}</dd>
                    </div>
                  )
                })}
              </dl>
            ))}
            <div className="fetch__swatches" aria-hidden="true">
              {SWATCHES.map((hue) => (
                <span key={hue} style={{ background: `var(--${hue})` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section" aria-labelledby="about-title">
      <SectionHead command="cat about.md" title="What kind of person I am" id="about-title">
        I am 18, I study in Montréal, and I would rather configure a tool for an hour than click through it for
        five minutes. A few things that describe me better than a list of adjectives:
      </SectionHead>

      <ul className="traits">
        {traits.map((trait) => (
          <li className="trait" key={trait.title}>
            <Sprite name={trait.sprite} size={48} />
            <div>
              <h3 className="trait__title">{trait.title}</h3>
              <p className="trait__body">{trait.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Toolbox() {
  return (
    <section className="section" aria-labelledby="toolbox-title">
      <SectionHead command="ls ~/toolbox" title="What I work with" id="toolbox-title" />
      <dl className="toolbox window">
        {toolbox.map((group) => (
          <div className="toolbox__row" key={group.dir}>
            <dt style={{ color: `var(--${group.hue})` }}>{group.dir}/</dt>
            <dd className="tags">
              {group.items.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function History() {
  return (
    <section className="section" aria-labelledby="history-title">
      <SectionHead command="git log --reverse" title="My history as a developer" id="history-title">
        I started the DEC in August 2025. Everything below happened since, in order.
      </SectionHead>

      <ol className="log">
        {timeline.map((commit) => (
          <li className={`log__entry${commit.head ? ' is-head' : ''}`} key={commit.hash}>
            <p className="log__meta">
              <span className="log__hash">{commit.hash}</span>
              {commit.head && (
                <span className="log__ref">
                  (<span className="log__ref-head">HEAD</span> → <span className="log__ref-branch">main</span>)
                </span>
              )}
              <time className="log__date">{commit.date}</time>
            </p>
            <h3 className="log__title">{commit.title}</h3>
            <p className="log__body">{commit.body}</p>
            {commit.repos && (
              <ul className="tags log__repos">
                {commit.repos.map((repo) => (
                  <li key={repo}>
                    <a className="tag tag--link" href={repoUrl(repo)} target="_blank" rel="noreferrer">
                      {repo}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <SectionHead command="cat ~/.config/contact" title="Find me elsewhere" id="contact-title">
        I am looking for a {profile.seeking}. Email is the fastest way to reach me.
      </SectionHead>
      <Socials />
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Fetch />
      <About />
      <Toolbox />
      <History />
      <Contact />
    </>
  )
}
