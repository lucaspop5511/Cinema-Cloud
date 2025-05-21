import { useState, createContext, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { WatchlistProvider } from './contexts/WatchlistContext'
import { CinemaContentProvider } from './contexts/CinemaContentContext'
import Home from './pages/Home'
import Cinema from './pages/Cinema'
import Watchlist from './pages/Watchlist'
import MovieDetail from './components/MovieDetail'
import TvDetail from './components/TvDetail'
import Header from './components/Header'
import GenrePanel from './components/GenrePanel'
import DetailPanel from './components/DetailPanel'
import Footer from './components/Footer'
import { getGenreMapping, fetchFromApi } from './services/api'
import './styles/App.css'

// Context to share state across components
export const AppContext = createContext(null)

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('movie')
  const [previousSearchType, setPreviousSearchType] = useState(null)
  const [minYear, setMinYear] = useState(1990)
  const [maxYear, setMaxYear] = useState(new Date().getFullYear())
  const [minRuntime, setMinRuntime] = useState(0)
  const [maxRuntime, setMaxRuntime] = useState(240)
  const [imdbRating, setImdbRating] = useState('none')
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [genreIdMapping, setGenreIdMapping] = useState({})
  const [filterCounter, setFilterCounter] = useState(0)
  const [clearFiltersCounter, setClearFiltersCounter] = useState(0)
  
  // Detail page state
  const [detailItem, setDetailItem] = useState(null)
  const [isDetailPage, setIsDetailPage] = useState(false)
  
  const location = useLocation()

  // Check if current route is a detail page
  useEffect(() => {
    const isDetail = location.pathname.includes('/movie/') || location.pathname.includes('/tv/')
    setIsDetailPage(isDetail)
    
    // Fetch detail item data when on detail page
    if (isDetail) {
      const pathParts = location.pathname.split('/')
      const mediaType = pathParts[1] // 'movie' or 'tv'
      const id = pathParts[2]
      
      const fetchDetailItem = async () => {
        try {
          const data = await fetchFromApi(`/${mediaType}/${id}?language=en-US`)
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
      
      // On desktop, panel always open 
      if (window.innerWidth >= 768 && (location.pathname === '/' || location.pathname === '/cinema' || location.pathname === '/watchlist')) {
        setIsPanelOpen(true)
      }
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [location.pathname])

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

  // Panel controls
  const openPanel = () => {
    if (isMobile) {
      setIsPanelOpen(true)
    }
  }

  const closePanel = () => {
    if (isMobile) {
      setIsPanelOpen(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (isMobile && isPanelOpen && (location.pathname === '/' || location.pathname === '/cinema' || location.pathname === '/watchlist')) {
      // Close panel on overlay click
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
    setMinYear(1990);
    setMaxYear(new Date().getFullYear());
    setMinRuntime(0);
    setMaxRuntime(240);
    setImdbRating('none');
    setIsFilterActive(false);
    // Don't clear search query when clearing filters
    setClearFiltersCounter(prev => prev + 1);
  }

  const applyFilters = () => {
    setIsFilterActive(true);
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
    imdbRating,
    setImdbRating,
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

  return (
    <AuthProvider>
      <WatchlistProvider>
        <CinemaContentProvider>
          <AppContext.Provider value={contextValue}>
            <div className={`app ${isPanelOpen ? 'panel-open' : ''}`}
             onClick={handleOverlayClick}>
              {/* Show GenrePanel on home, cinema, and watchlist pages */}
              {(location.pathname === '/' || location.pathname === '/cinema' || location.pathname === '/watchlist') && (
                <GenrePanel 
                  isOpen={isPanelOpen} 
                  closePanel={closePanel}
                />
              )}

              {/* Show DetailPanel only on detail pages */}
              {isDetailPage && (
                <DetailPanel 
                  item={detailItem}
                  isOpen={isPanelOpen} 
                  closePanel={closePanel}
                  mediaType={location.pathname.includes('/movie/') ? 'movie' : 'tv'}
                />
              )}
              
              <div className={`content-wrapper ${!isMobile && (location.pathname === '/' || location.pathname === '/cinema' || location.pathname === '/watchlist' || isDetailPage) && 'with-sidebar'}`}>
                <Header openPanel={openPanel} isPanelOpen={isPanelOpen} isMobile={isMobile} />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cinema" element={<Cinema />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/movie/:id" element={<MovieDetail />} />
                    <Route path="/tv/:id" element={<TvDetail />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
          </AppContext.Provider>
        </CinemaContentProvider>
      </WatchlistProvider>
    </AuthProvider>
  )
}

export default App