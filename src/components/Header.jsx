import { Link } from 'react-router-dom'
import GenreDropdown from './GenreDropdown'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-text">Cinema Cloud</div>
        </Link>
        <nav className="nav-links">
          <GenreDropdown />
          <Link to="/cinema" className="nav-link">Cinema</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header