import { useState, createContext, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Cinema from './pages/Cinema'
import MovieDetail from './components/MovieDetail'
import TvDetail from './components/TvDetail'
import Header from './components/Header'
import GenrePanel from './components/GenrePanel'
import DetailPanel from './components/DetailPanel'
import Footer from './components/Footer'
import { getGenreMapping, fetchFromApi } from './services/api'
import './styles/App.css'

// Create a context to share state across components
export const AppContext = createContext(null)

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('movie')
  const [previousSearchType, setPreviousSearchType] = useState(null)
  const [minYear, setMinYear] = useState(1990) // Updated from 1900 to 1990
  const [maxYear, setMaxYear] = useState(new Date().getFullYear())
  const [minRuntime, setMinRuntime] = useState(0) // Updated from 30 to 0
  const [maxRuntime, setMaxRuntime] = useState(240)
  const [contentRatings, setContentRatings] = useState([])
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [genreIdMapping, setGenreIdMapping] = useState({})
  const [filterCounter, setFilterCounter] = useState(0) // Track filter changes
  const [clearFiltersCounter, setClearFiltersCounter] = useState(0) // Track clear filter events
  
  // Detail page state
  const [detailItem, setDetailItem] = useState(null)
  const [isDetailPage, setIsDetailPage] = useState(false)
  
  const location = useLocation()

  // Debug current location
  useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location.pathname]);

  // Check if current route is a detail page
  useEffect(() => {
    const isDetail = location.pathname.includes('/movie/') || location.pathname.includes('/tv/')
    setIsDetailPage(isDetail)
    
    console.log('Is detail page:', isDetail, 'Route:', location.pathname);
    
    // Fetch detail item data when on detail page
    if (isDetail) {
      const pathParts = location.pathname.split('/')
      const mediaType = pathParts[1] // 'movie' or 'tv'
      const id = pathParts[2]
      
      console.log('Fetching detail item - MediaType:', mediaType, 'ID:', id);
      
      const fetchDetailItem = async () => {
        try {
          const data = await fetchFromApi(`/${mediaType}/${id}?language=en-US`)
          console.log('Detail item fetched:', data);
          setDetailItem(data)
        } catch (error) {
          console.error('Error fetching detail item:', error)
          setDetailItem(null)
        }
      }
      
      fetchDetailItem()
    } else {
      setDetailItem(null)
    }
  }, [location.pathname])

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

  // Load genre mappings when search type changes
  useEffect(() => {
    const loadGenreMappings = async () => {
      try {
        const mapping = await getGenreMapping(searchType);
        setGenreIdMapping(mapping);
      } catch (error) {
        console.error('Error loading genre mappings:', error);
      }
    };
    
    loadGenreMappings();
  }, [searchType]);

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
      const panelElement = document.querySelector('.genre-panel, .detail-panel');
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

  const clearFilters = () => {
    setSelectedGenres([]);
    setMinYear(1990); // Reset to new default of 1990
    setMaxYear(new Date().getFullYear());
    setMinRuntime(0); // Reset to new default of 0
    setMaxRuntime(240);
    setContentRatings([]);
    setIsFilterActive(false);
    setClearFiltersCounter(prev => prev + 1); // Increment to trigger re-search
  }

  const applyFilters = () => {
    setIsFilterActive(true);
    // Increment filter counter to trigger useEffect in Home.jsx
    setFilterCounter(prev => prev + 1); 
  }

  // Context value
  const contextValue = {
    isPanelOpen,
    isMobile,
    selectedGenres,
    setSelectedGenres,
    toggleGenre,
    openPanel,
    closePanel,
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    previousSearchType,
    setPreviousSearchType,
    minYear,
    setMinYear,
    maxYear,
    setMaxYear,
    minRuntime,
    setMinRuntime,
    maxRuntime,
    setMaxRuntime,
    contentRatings,
    setContentRatings,
    isFilterActive,
    setIsFilterActive,
    clearFilters,
    applyFilters,
    genreIdMapping,
    filterCounter,
    clearFiltersCounter,
    detailItem,
    isDetailPage
  }

  console.log('App rendering - isDetailPage:', isDetailPage, 'Current route:', location.pathname);

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`app ${isPanelOpen ? 'panel-open' : ''}`}
       onClick={handleOverlayClick}>
        {/* Render appropriate panel based on current page */}
        {isDetailPage ? (
          <DetailPanel 
            item={detailItem}
            isOpen={isPanelOpen} 
            closePanel={closePanel}
            mediaType={location.pathname.includes('/movie/') ? 'movie' : 'tv'}
          />
        ) : (
          <GenrePanel 
            isOpen={isPanelOpen} 
            closePanel={closePanel}
          />
        )}
        
        <div className={`content-wrapper ${!isMobile && 'with-sidebar'}`}>
          <Header openPanel={openPanel} isPanelOpen={isPanelOpen} isMobile={isMobile} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cinema" element={<Cinema />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv/:id" element={<TvDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App