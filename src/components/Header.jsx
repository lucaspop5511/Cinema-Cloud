import { Link, useLocation } from 'react-router-dom'

function Header({ togglePanel, isPanelOpen }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isCinema = location.pathname === '/cinema';

  return (
    <header className="header">
      <div className="header-content">
        <div className="left-section">
          <button 
            type="button"
            className={`genre-button ${isPanelOpen ? 'active' : ''}`}
            onClick={togglePanel}
          >
            <span className="genre-button-text">Categories</span>
            <span className="genre-button-icon">{isPanelOpen ? '◄' : '►'}</span>
          </button>
        </div>
        
        <div className="center-section">
          <Link to="/" className={`logo ${isHome ? 'active' : ''}`}>
            <div className="logo-text">Cinema Cloud</div>
          </Link>
        </div>
        
        <div className="right-section">
          <Link to="/cinema" className={`nav-link ${isCinema ? 'active' : ''}`}>
            Cinema
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header