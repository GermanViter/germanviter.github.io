import { Link, useLocation } from 'react-router-dom'
import { Prompt } from '../components/SectionHead'
import { PixelText } from '../pixel/PixelText'

export function NotFound() {
  const { pathname } = useLocation()

  return (
    <header className="page-head">
      <Prompt command={`cd ${pathname}`} />
      <h1 className="page-head__title">
        <span className="sr-only">404, page not found</span>
        <PixelText text="404" shadow tracking={2} animate />
      </h1>
      <p className="page-head__lead">cd: no such file or directory: {pathname}</p>
      <p style={{ marginTop: 24 }}>
        <Link className="btn btn--primary" to="/">
          cd ~
        </Link>
      </p>
    </header>
  )
}
