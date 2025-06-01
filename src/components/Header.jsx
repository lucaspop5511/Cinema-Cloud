import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header({ openPanel, isPanelOpen, isMobile }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isCinema = pathname === '/cinema';

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
          <Link href="/" className={`logo ${isHome ? 'active' : ''}`}>
            <div className="logo-text">Cinema Cloud</div>
          </Link>
        </div>
        
        <div className="right-section">
          <Link href="/cinema" className={`nav-link ${isCinema ? 'active' : ''}`}>
            <span className="nav-link-text">Watch</span>
            <svg className="camera-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className="film-reel film-reel-1">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                <circle cx="6" cy="6" r="1" fill="currentColor"/>
                <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1"/>
                <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1"/>
              </g>
              <g className="film-reel film-reel-2">
                <circle cx="14" cy="6" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                <circle cx="14" cy="6" r="1" fill="currentColor"/>
                <line x1="14" y1="2" x2="14" y2="10" stroke="currentColor" strokeWidth="1"/>
                <line x1="10" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1"/>
              </g>
              <rect x="2" y="11" width="16" height="9" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="18.5" y="13" width="4" height="4.5" rx="0.5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header