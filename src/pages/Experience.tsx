import { Link } from 'react-router-dom'
import { Prompt, SectionHead } from '../components/SectionHead'
import { jobs } from '../data/experience'
import { profile, socials } from '../data/profile'
import { PixelText } from '../pixel/PixelText'
import { Sprite } from '../pixel/Sprite'
import './Experience.css'

const linkedin = socials.find((social) => social.id === 'linkedin')

export function Experience() {
  return (
    <>
      <header className="page-head">
        <Prompt dir="~/experience" command="cat jobs.log" />
        <h1 className="page-head__title">
          <span className="sr-only">Experience</span>
          <PixelText text="EXPERIENCE" shadow tracking={2} animate />
        </h1>
        <p className="page-head__lead">
          Where I have worked so far. None of it is in tech yet, which is exactly what a {profile.seeking} is
          for.
        </p>
      </header>

      <section className="section" aria-labelledby="jobs-title">
        <SectionHead dir="~/experience" command="systemctl status 'job@*'" title="Work experience" id="jobs-title" />

        <ol className="jobs">
          {jobs.map((job) => (
            <li className="job window" key={job.id}>
              <div className="window__bar">
                <span className={`job__state${job.current ? ' is-active' : ''}`}>
                  <span className="dot" aria-hidden="true" />
                  {job.current ? 'active (running)' : 'inactive (exited)'}
                </span>
                <span className="window__meta">{job.period}</span>
              </div>
              <div className="window__body job__body">
                <Sprite name={job.sprite} size={64} className="job__sprite" />
                <div className="job__main">
                  <h3 className="job__role">{job.role}</h3>
                  <p className="job__company">{job.company}</p>
                  <ul className="job__duties">
                    {job.duties.map((duty) => (
                      <li key={duty}>{duty}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="next-title">
        <div className="next window">
          <div className="window__body next__body">
            <Prompt dir="~/experience" command="echo $NEXT" />
            <h2 className="section__title" id="next-title">
              The next entry should be a dev job
            </h2>
            <p className="next__text">
              I am looking for a {profile.seeking} in software. If you want to know what I can do, the{' '}
              <Link className="link" to="/projects">
                projects page
              </Link>{' '}
              says it better than a résumé.
            </p>
            <div className="next__actions">
              <a className="btn btn--primary" href={`mailto:${profile.email}`}>
                <Sprite name="mail" size={16} />
                Email me
              </a>
              {linkedin && (
                <a className="btn" href={linkedin.href} target="_blank" rel="noreferrer">
                  <Sprite name="linkedin" size={16} />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
