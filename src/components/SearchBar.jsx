import { useState } from 'react'

function SearchBar() {
  const [searchType, setSearchType] = useState('movie')
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search logic here
    console.log(`Searching for ${searchType}: ${searchQuery}`)
  }

  return (
    <div className="search-container">
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-submit">Search</button>
      </form>
    </div>
  )
}

export default SearchBar