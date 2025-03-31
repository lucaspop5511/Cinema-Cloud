import { useState, useRef, useEffect } from 'react'

function SearchBar({ searchQuery, setSearchQuery, isRaised }) {
  const [searchType, setSearchType] = useState('movie')
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const searchTimeout = useRef(null)
  const initialRender = useRef(true)
  
  // Synchronize local state with parent state
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(localSearchQuery)
    console.log(`Searching for ${searchType}: ${localSearchQuery}`)
  }
  
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
  
  return (
    <div className={`search-container ${isRaised ? 'raised' : ''}`}>
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-type">
          <button 
            type="button"
            className={`search-type-button ${searchType === 'movie' ? 'active' : ''}`}
            onClick={() => setSearchType('movie')}
          >
            Movies
          </button>
          <button 
            type="button"
            className={`search-type-button ${searchType === 'tv' ? 'active' : ''}`}
            onClick={() => setSearchType('tv')}
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
        <button type="submit" className="search-submit">Search</button>
      </form>
    </div>
  )
}

export default SearchBar