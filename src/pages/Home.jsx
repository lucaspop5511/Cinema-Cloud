import { useState, useContext } from 'react'
import SearchBar from '../components/SearchBar'
import { AppContext } from '../App'

function Home() {
  const { selectedGenres } = useContext(AppContext)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="home-container">
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <div className="search-results">
        {/* This area will show search results or content based on selected genres */}
        {(searchQuery.trim() !== '' || selectedGenres.length > 0) && (
          <div className="results-container">
            {searchQuery.trim() !== '' && (
              <h2 className="results-title">Results for: {searchQuery}</h2>
            )}
            
            {selectedGenres.length > 0 && (
              <div className="selected-genres">
                <h2 className="results-title">Selected Categories:</h2>
                <div className="genre-tags">
                  {selectedGenres.map(genre => (
                    <span key={genre} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Placeholder for actual results */}
            <div className="placeholder-results">
              <p>Content will appear here based on your search or selected categories.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home