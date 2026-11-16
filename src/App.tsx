import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Bar } from './components/Bar'
import { Footer } from './components/Footer'
import { WORKSPACES } from './data/nav'
import { useFlavor } from './hooks/useFlavor'
import { useHotkeys } from './hooks/useHotkeys'
import { Experience } from './pages/Experience'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Projects } from './pages/Projects'
import { PixelField } from './pixel/PixelField'

const TITLES: Record<string, string> = {
  '/': 'German Viter · IT student and Linux ricer',
  '/projects': 'Projects · German Viter',
  '/experience': 'Experience · German Viter',
}

function Shell() {
  const { flavor, cycle } = useFlavor()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useHotkeys({
    ...Object.fromEntries(WORKSPACES.map((workspace) => [workspace.key, () => navigate(workspace.to)])),
    t: cycle,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = TITLES[pathname] ?? 'Not found · German Viter'
  }, [pathname])

  return (
    <div className="shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          // The URL hash belongs to the router, so move focus by hand.
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      <PixelField flavor={flavor} />
      <Bar flavor={flavor} onCycleFlavor={cycle} />
      <main className="page" id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
