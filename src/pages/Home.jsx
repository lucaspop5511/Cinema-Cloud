import { useState, useEffect, useContext } from 'react'
import SearchBar from '../components/SearchBar'
import { AppContext } from '../App'

function Home() {
  const { selectedGenres } = useContext(AppContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchRaised, setIsSearchRaised] = useState(false)

  // Check if search should be in raised position
  useEffect(() => {
    let searchTimer;
    
    if (searchQuery.trim() !== '' || selectedGenres.length > 0) {
      setIsSearchRaised(true);
    } else {
      // Add a small delay before lowering the search bar to ensure animations sequence properly
      searchTimer = setTimeout(() => {
        setIsSearchRaised(false);
      }, 100);
    }
    
    return () => clearTimeout(searchTimer);
  }, [searchQuery, selectedGenres]);

  return (
    <div className={`home-container ${isSearchRaised ? 'search-raised' : ''}`}>
      <div className="home-content">
        <h1 className="welcome-text">Cinema Cloud</h1>
        <p className="subtitle">Discover your next favorite movie or TV show</p>
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          isRaised={isSearchRaised}
        />
      </div>
      
      <div className="search-results">
        {/* This area will show search results or content based on selected genres */}
        {(searchQuery.trim() !== '' || selectedGenres.length > 0) && (
          <div className="results-container">
            {searchQuery.trim() !== '' && (
              <h2>Results for: {searchQuery}</h2>
            )}
            
            {selectedGenres.length > 0 && (
              <div className="selected-genres">
                <h2>Selected Categories:</h2>
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