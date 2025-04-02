import { useState, createContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cinema from './pages/Cinema'
import Header from './components/Header'
// Use GenrePanel instead of FilterPanel to match your file structure
import GenrePanel from './components/GenrePanel'
import Footer from './components/Footer'
import './styles/App.css'

// Create a context to share state across components
export const AppContext = createContext(null)

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])

  // Check if the device is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      
      // On desktop, panel should always be open
      if (window.innerWidth >= 768) {
        setIsPanelOpen(true)
      }
    }
    
    // Initial check
    checkIfMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Open panel function (mobile only)
  const openPanel = () => {
    if (isMobile) {
      setIsPanelOpen(true)
    }
  }

  // Close panel function (mobile only)
  const closePanel = () => {
    if (isMobile) {
      setIsPanelOpen(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (isMobile && isPanelOpen) {
      // Check if the click was outside the panel
      const panelElement = document.querySelector('.genre-panel');
      if (panelElement && !panelElement.contains(e.target)) {
        closePanel();
      }
    }
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prevGenres => 
      prevGenres.includes(genre)
        ? prevGenres.filter(g => g !== genre)
        : [...prevGenres, genre]
    )
  }

  // Context value
  const contextValue = {
    isPanelOpen,
    isMobile,
    selectedGenres,
    openPanel,
    closePanel,
    toggleGenre
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`app ${isPanelOpen ? 'panel-open' : ''}`}
       onClick={handleOverlayClick}>
        <GenrePanel 
          isOpen={isPanelOpen} 
          closePanel={closePanel}
        />
        <div className={`content-wrapper ${!isMobile && 'with-sidebar'}`}>
          <Header openPanel={openPanel} isPanelOpen={isPanelOpen} isMobile={isMobile} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cinema" element={<Cinema />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App