import { useState, useRef, useContext } from 'react'
import { AppContext } from '../App'

function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }) {
  const { 
    isFilterActive, 
    applyFilters 
  } = useContext(AppContext)
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const searchTimeout = useRef(null)
  
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
    }, 500) // 500ms delay
  }
  
  // Handle media type switch
  const handleMediaTypeChange = (type) => {
    if (type !== searchType) {
      setSearchType(type)
      
      // If filters are active, automatically apply them when switching media type
      if (isFilterActive) {
        // Use a small timeout to ensure the type change happens first
        setTimeout(() => {
          applyFilters()
        }, 100)
      }
    }
  }
  
  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-type">
          <button 
            type="button"
            className={`search-type-button ${searchType === 'movie' ? 'active' : ''}`}
            onClick={() => handleMediaTypeChange('movie')}
          >
            Movies
          </button>
          <button 
            type="button"
            className={`search-type-button ${searchType === 'tv' ? 'active' : ''}`}
            onClick={() => handleMediaTypeChange('tv')}
          >
            TV Shows
          </button>
        </div>
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