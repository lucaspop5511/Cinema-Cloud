'use client'

import { useState, createContext, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '../contexts/AuthContext'
import { WatchlistProvider } from '../contexts/WatchlistContext'
import { CinemaContentProvider } from '../contexts/CinemaContentContext'
import Header from './Header'
import GenrePanel from './GenrePanel'
import DetailPanel from './DetailPanel'
import Footer from './Footer'
import { getGenreMapping, fetchFromApi } from '../services/api'

export const AppContext = createContext(null)

export default function AppWrapper({ children }) {
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
  const [detailItem, setDetailItem] = useState(null)
  const [isDetailPage, setIsDetailPage] = useState(false)
  
  const pathname = usePathname()

  useEffect(() => {
    const isDetail = pathname.includes('/movie/') || pathname.includes('/tv/')
    setIsDetailPage(isDetail)
    
    if (isDetail) {
      const pathParts = pathname.split('/')
      const mediaType = pathParts[1]
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
  }, [pathname])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      
      if (window.innerWidth >= 768 && (pathname === '/' || pathname === '/cinema' || pathname === '/watchlist')) {
        setIsPanelOpen(true)
      }
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [pathname])

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
    if (isMobile && isPanelOpen && (pathname === '/' || pathname === '/cinema' || pathname === '/watchlist')) {
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
    setClearFiltersCounter(prev => prev + 1);
  }

  const applyFilters = () => {
    setIsFilterActive(true);
    setFilterCounter(prev => prev + 1); 
  }

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
            <div className={`app ${isPanelOpen ? 'panel-open' : ''}`} onClick={handleOverlayClick}>
              {(pathname === '/' || pathname === '/cinema' || pathname === '/watchlist') && (
                <GenrePanel 
                  isOpen={isPanelOpen} 
                  closePanel={closePanel}
                />
              )}

              {isDetailPage && isMobile && (
                <DetailPanel 
                  item={detailItem}
                  isOpen={isPanelOpen} 
                  closePanel={closePanel}
                  mediaType={pathname.includes('/movie/') ? 'movie' : 'tv'}
                />
              )}
              
              <div className={`content-wrapper ${(pathname === '/' || pathname === '/cinema' || pathname === '/watchlist') && !isMobile ? 'with-sidebar' : ''}`}>
                <Header openPanel={openPanel} isPanelOpen={isPanelOpen} isMobile={isMobile} />
                <main className="main-content">
                  {children}
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