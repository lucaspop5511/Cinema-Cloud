import { useState, useRef, useContext } from 'react'
import { AppContext } from '../App'
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
  
  // Check if any filters are applied (non-default values)
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
    
    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    
    // Set a new timeout to update the parent state after typing stops
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(newValue)
      
      // If we have active filters and we're searching, apply filters to combine them
      if (hasActiveFilters() && newValue.trim() !== '') {
        console.log('Search with active filters, applying filters');
        applyFilters();
      }
    }, 500) // 500ms delay
  }
  
  // Handle media type switch
  const handleMediaTypeChange = (type) => {
    if (type !== searchType) {
      setSearchType(type)
      
      // If we have active filters or a search query, automatically apply them when switching media type
      if (isFilterActive || hasActiveFilters() || (searchQuery && searchQuery.trim() !== '')) {
        // Use a small timeout to ensure the type change happens first
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
      
      {/* Media Type Picker - matches cinema page style */}
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
      
      {/* Search Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          className="search-input"
          placeholder={`Search for ${searchType === 'movie' ? 'movies' : 'TV shows'}...`}
          value={localSearchQuery}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

export default SearchBar