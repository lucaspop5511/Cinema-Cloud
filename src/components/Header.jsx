import { Link } from 'react-router-dom'

function Header({ togglePanel, isPanelOpen }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="left-section">
          <button 
            type="button"
            className="genre-button" 
            onClick={togglePanel}
          >
            {isPanelOpen ? 'Categories ◄' : 'Categories ►'}
          </button>
        </div>
        
        <div className="center-section">
          <Link to="/" className="logo">
            <div className="logo-text">Cinema Cloud</div>
          </Link>
        </div>
        
        <div className="right-section">
          <Link to="/cinema" className="nav-link">Cinema</Link>
        </div>
      </div>
    </header>
  )
}

export default Header