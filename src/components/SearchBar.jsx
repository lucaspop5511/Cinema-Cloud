import { useState, useRef, useContext } from 'react'
import { AppContext } from './AppWrapper'
import CloudsBackground from './CloudsBackground';
import '../styles/SearchBar.css'

function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }) {
  const { 
    isFilterActive, 
    applyFilters,
    selectedGenres,
    minYear,
    maxYear,
    minRuntime,
    maxRuntime,
    imdbRating
  } = useContext(AppContext)
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const searchTimeout = useRef(null)
  
  const hasActiveFilters = () => {
    return selectedGenres.length > 0 || 
           minYear !== 1990 || 
           maxYear !== new Date().getFullYear() ||
           minRuntime !== 0 ||
           maxRuntime !== 240 ||
           imdbRating !== 'none';
  };
  
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setLocalSearchQuery(newValue)
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(newValue)
      
      // If we have active filters and were searching, apply filters to combine
      if (hasActiveFilters() && newValue.trim() !== '') {
        console.log('Search with active filters, applying filters');
        applyFilters();
      }
    }, 500)
  }

  const handleClearSearch = () => {
    setLocalSearchQuery('')
  setSearchQuery('')
  
  if (searchTimeout.current) {
    clearTimeout(searchTimeout.current)
  }
  
  // Focus back on input
  document.querySelector('.search-input').focus()
  }
  
  const handleMediaTypeChange = (type) => {
    if (type !== searchType) {
      setSearchType(type)
      
      // If filters active, automatically apply when switching media type
      if (isFilterActive || hasActiveFilters() || (searchQuery && searchQuery.trim() !== '')) {
        // Use a small timeout to make sure the type change happens first
        setTimeout(() => {
          console.log('Media type changed, applying filters/search');
          applyFilters()
        }, 100)
      }
    }
  }
  
  return (
    <div className="search-container">
      <CloudsBackground />
      <h1 className="search-page-title">Find your favourite {searchType === 'movie' ? 'movies' : 'TV shows'}</h1>
      
      <div className="media-type-picker">
        <button 
          type="button"
          className={`media-type-button ${searchType === 'movie' ? 'active' : ''}`}
          onClick={() => handleMediaTypeChange('movie')}
        >
          Movies
        </button>
        <button 
          type="button"
          className={`media-type-button ${searchType === 'tv' ? 'active' : ''}`}
          onClick={() => handleMediaTypeChange('tv')}
        >
          TV Shows
        </button>
      </div>
      
      <div className="search-bar">
        <input 
          type="text" 
          className="search-input"
          placeholder={`Search for ${searchType === 'movie' ? 'movies' : 'TV shows'}...`}
          value={localSearchQuery}
          onChange={handleInputChange}
        />
          <button 
            type="button"
            className={`clear-search-btn ${!localSearchQuery ? 'empty' : ''}`}
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
      </div>
    </div>
  )
}

export default SearchBar