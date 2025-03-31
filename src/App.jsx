import { useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cinema from './pages/Cinema'
import Header from './components/Header'
import GenrePanel from './components/GenrePanel'
import Footer from './components/Footer'
import './styles/App.css'

// Create a context to share state across components
export const AppContext = createContext(null)

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen)
  }

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
    selectedGenres,
    togglePanel,
    toggleGenre
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`app ${isPanelOpen ? 'panel-open' : ''}`}>
        <GenrePanel 
          isOpen={isPanelOpen} 
          selectedGenres={selectedGenres} 
          toggleGenre={toggleGenre} 
        />
        <div className="content-wrapper">
          <Header togglePanel={togglePanel} isPanelOpen={isPanelOpen} />
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