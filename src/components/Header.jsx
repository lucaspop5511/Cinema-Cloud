import { Link, useLocation } from 'react-router-dom'

function Header({ openPanel, isPanelOpen, isMobile }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isCinema = location.pathname === '/cinema';

  return (
    <header className="header">
      <div className="header-content">
        <div className="left-section">
          {isMobile && !isPanelOpen && (
            <button 
              type="button"
              className="hamburger-button"
              onClick={openPanel}
              aria-label="Open menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          )}
        </div>
        
        <div className="center-section">
          <Link to="/" className={`logo ${isHome ? 'active' : ''}`}>
            <div className="logo-text">Cinema Cloud</div>
          </Link>
        </div>
        
        <div className="right-section">
          <Link to="/cinema" className={`nav-link ${isCinema ? 'active' : ''}`}>
            Watch
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header