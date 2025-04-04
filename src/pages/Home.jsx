import { useState, useContext, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { AppContext } from '../App'
import { searchMovies, searchTvShows } from '../services/tmdbApi'

function Home() {
  const { selectedGenres } = useContext(AppContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('movie')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let data;
        if (searchType === 'movie') {
          data = await searchMovies(searchQuery);
        } else {
          data = await searchTvShows(searchQuery);
        }

        setResults(data.results || []);
      } catch (err) {
        setError('Failed to fetch results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    // If search query is at least 3 characters, fetch results
    if (searchQuery.trim().length >= 3) {
      fetchResults();
    }
  }, [searchQuery, searchType]);

  return (
    <div className="home-container">
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
      />
      
      <div className="search-results">
        {loading && (
          <div className="loading-indicator">
            <p>Loading results...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && searchQuery.trim() !== '' && (
          <SearchResults 
            results={results} 
            searchType={searchType}
            searchQuery={searchQuery}
          />
        )}
        
        {selectedGenres.length > 0 && !searchQuery && (
          <div className="genre-results">
            <div className="genre-tags">
              {selectedGenres.map(genre => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
            {/* We'll implement genre-based results later */}
            <div className="placeholder-results">
              <p>Category browsing will be implemented in the next phase.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home