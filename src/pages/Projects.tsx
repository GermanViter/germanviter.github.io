import { Activity } from '../components/Activity'
import { Prompt, SectionHead } from '../components/SectionHead'
import {
  dotfiles,
  hueOf,
  inProgress,
  moreRepos,
  pinned,
  repoUrl,
  type DotfilesNode,
  type PinnedProject,
} from '../data/projects'
import { PixelText } from '../pixel/PixelText'
import { Sprite } from '../pixel/Sprite'
import './Projects.css'

function Language({ name }: { name: string }) {
  return (
    <span className="language">
      <span className="dot" style={{ color: `var(--${hueOf(name)})` }} aria-hidden="true" />
      {name}
    </span>
  )
}

/** A slice of lua/plugins/scheme.lua from the init.lua repo, as it looks in the editor. */
function NvimBuffer() {
  const k = (text: string) => <span className="hl-keyword">{text}</span>
  const s = (text: string) => <span className="hl-string">{text}</span>
  const n = (text: string) => <span className="hl-number">{text}</span>
  const f = (text: string) => <span className="hl-function">{text}</span>
  const p = (text: string) => <span className="hl-property">{text}</span>

  const lines = [
    <>{k('return')} {'{'}</>,
    <>  {s('"catppuccin/nvim"')},</>,
    <>  {p('lazy')} = {n('false')},</>,
    <>  {p('priority')} = {n('1000')},</>,
    <>  {p('config')} = {k('function')}()</>,
    <>    {f('require')}({s('"catppuccin"')}).{f('setup')}({'{'}</>,
    <>      {p('flavour')} = {s('"mocha"')},</>,
    <>      {p('transparent_background')} = {n('true')},</>,
    <>    {'}'})</>,
    <>    vim.cmd.{f('colorscheme')}({s('"catppuccin"')})</>,
    <>  {k('end')}</>,
    <>{'}'}</>,
  ]

  return (
    <div className="nvim" role="img" aria-label="The Catppuccin Mocha colorscheme setup from my Neovim config">
      <pre className="nvim__code" aria-hidden="true">
        {lines.map((line, index) => (
          <span className="nvim__line" key={index}>
            <span className="nvim__number">{index + 1}</span>
            {line}
            {'\n'}
          </span>
        ))}
      </pre>
      <div className="nvim__status" aria-hidden="true">
        <span className="nvim__mode">NORMAL</span>
        <span className="nvim__file">lua/plugins/scheme.lua</span>
        <span className="nvim__pos">lua · 1:1</span>
      </div>
    </div>
  )
}

function PinnedCard({ project, index }: { project: PinnedProject; index: number }) {
  const { media, url } = project

  return (
    <li className="pin window window--hover">
      <div className="window__bar">
        <span className="window__title">~/pinned/{project.name}</span>
        <span className="window__meta">
          {index + 1}/{pinned.length}
        </span>
      </div>

      <div className="pin__media">
        {media.kind === 'code' ? (
          <NvimBuffer />
        ) : media.kind === 'placeholder' ? (
          <div className="pin__placeholder">
            <Sprite name={project.sprite} size={96} />
          </div>
        ) : (
          <img
            src={media.src}
            alt={media.alt}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              objectFit: media.fit,
              background: media.background,
              imageRendering: media.pixelated ? 'pixelated' : undefined,
            }}
          />
        )}
      </div>

      <div className="pin__body">
        <div className="pin__head">
          <Sprite name={project.sprite} size={48} />
          <div>
            <h3 className="pin__name">
              <a href={url} target="_blank" rel="noreferrer">
                {project.name}
              </a>
            </h3>
            {project.tagline && <p className="pin__tagline">{project.tagline}</p>}
          </div>
        </div>

        {/* A repo I only just pinned has no override yet, so any of these can be missing. */}
        {project.description && <p className="pin__description">{project.description}</p>}

        {project.highlights.length > 0 && (
          <ul className="pin__highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}

        {project.tags.length > 0 && (
          <ul className="tags">
            {project.tags.map((tag) => (
              <li className="tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="pin__foot">
          {project.language && <Language name={project.language} />}
          <span className="pin__since">since {project.since}</span>
          <a className="pin__link" href={url} target="_blank" rel="noreferrer" aria-label={`${project.name} on GitHub`}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </li>
  )
}

function DotfilesRepo({ node, child = false }: { node: DotfilesNode; child?: boolean }) {
  return (
    <li className="tree__node">
      {child && <span className="tree__branch" aria-hidden="true" />}
      <a
        className="tree__card"
        href={repoUrl(node.name)}
        target="_blank"
        rel="noreferrer"
        style={{ '--hue': `var(--${node.hue})` } as React.CSSProperties}
      >
        <span className="tree__name">{node.name}/</span>
        <span className="tree__role">{node.role}</span>
        <span className="tree__note">{node.note}</span>
      </a>
    </li>
  )
}

export function Projects() {
  return (
    <>
      <header className="page-head">
        <Prompt dir="~/projects" command="ls" />
        <h1 className="page-head__title">
          <span className="sr-only">Projects</span>
          <PixelText text="PROJECTS" shadow tracking={2} animate />
        </h1>
        <p className="page-head__lead">
          The repos pinned on my GitHub profile, the dotfiles that tie my machines together, and everything
          else I have pushed since I started.
        </p>
      </header>

      <section className="section" aria-labelledby="activity-title">
        <SectionHead dir="~/projects" command="git log --since='1 year ago'" title="A year on GitHub" id="activity-title">
          Every commit, pull request and issue from the last twelve months, and the languages my public repos are
          written in.
        </SectionHead>
        <Activity />
      </section>

      <section className="section" aria-labelledby="pinned-title">
        <SectionHead dir="~/projects" command="ls pinned/" title="The ones I am proudest of" id="pinned-title" />
        <ul className="pins">
          {pinned.map((project, index) => (
            <PinnedCard project={project} index={index} key={project.name} />
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="dotfiles-title">
        <SectionHead dir="~/projects" command="tree ~/.dotfiles" title="One setup, every machine" id="dotfiles-title">
          Ricing is only fun if you do not have to redo it on every install. So my configs are split into a shared
          core and one repo per system, each with a script that sets up a fresh machine.
        </SectionHead>

        <ul className="tree">
          <DotfilesRepo node={dotfiles.core} />
          {dotfiles.systems.map((node) => (
            <DotfilesRepo node={node} child key={node.name} />
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="wip-title">
        <SectionHead dir="~/projects" command="git status" title="Currently working on" id="wip-title" />
        <ul className="wips">
          {inProgress.map((project) => (
            <li className="wip window window--hover" key={project.name}>
              <div className="window__bar">
                <span className="wip__status">
                  <span className="dot" aria-hidden="true" />
                  modified
                </span>
                <span className="window__meta">
                  <Language name={project.language} />
                </span>
              </div>
              <div className="window__body">
                <h3 className="pin__name">
                  <a href={repoUrl(project.name)} target="_blank" rel="noreferrer">
                    {project.name}
                  </a>
                </h3>
                <p className="wip__context">{project.context}</p>
                <p className="pin__description">{project.description}</p>
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li className="tag" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="more-title">
        <SectionHead dir="~/projects" command="ls -lt more/" title="Everything else" id="more-title">
          Class projects, things I built to learn a language, and a plugin.
        </SectionHead>

        <ul className="listing window">
          {moreRepos.map((repo) => (
            <li key={repo.name}>
              <a className="listing__row" href={repoUrl(repo.name)} target="_blank" rel="noreferrer">
                <span className="listing__date">{repo.date}</span>
                <span className="listing__lang">
                  <Language name={repo.language} />
                </span>
                <span className="listing__name">{repo.name}</span>
                <span className="listing__desc">{repo.description}</span>
                <span className="listing__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
