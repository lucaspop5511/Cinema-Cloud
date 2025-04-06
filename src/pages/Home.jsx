import { useState, useContext, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import FilterHeader from '../components/FilterHeader'
import { AppContext } from '../App'
import { searchMovies, searchTvShows, getFilteredContent } from '../services/tmdbApi'

function Home() {
  const { 
    selectedGenres,
    searchQuery, 
    setSearchQuery,
    searchType, 
    setSearchType,
    minYear,
    maxYear,
    minRuntime,
    maxRuntime,
    contentRatings,
    isFilterActive,
    setIsFilterActive,
    genreIdMapping,
    filterCounter,
    clearFiltersCounter
  } = useContext(AppContext)
  
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)

  // Function to fetch content based on current state
  const fetchContent = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;
      const hasFilters = selectedGenres.length > 0 || 
                         minYear !== 1900 || 
                         maxYear !== new Date().getFullYear() ||
                         minRuntime !== 30 ||
                         maxRuntime !== 240 ||
                         contentRatings.length > 0;

      // Convert selected genre names to IDs
      const genreIds = selectedGenres.map(genre => genreIdMapping[genre]).filter(id => id);
      
      // Prepare filters object
      const filterParams = {
        mediaType: searchType,
        genres: genreIds,
        minYear,
        maxYear,
        minRuntime,
        maxRuntime,
        contentRatings,
        sortBy: 'popularity' // Always sort by popularity
      };

      // Determine which API to call based on search query and filters
      if (searchQuery.trim().length >= 2) {
        // If we have a search query, use search API
        if (hasFilters) {
          // Combine search with filters
          filterParams.query = searchQuery;
          data = await getFilteredContent(filterParams);
        } else {
          // Just search without filters
          if (searchType === 'movie') {
            data = await searchMovies(searchQuery);
          } else {
            data = await searchTvShows(searchQuery);
          }
        }
      } else if (hasFilters) {
        // If we have filters but no search query, use discover API
        data = await getFilteredContent(filterParams);
      } else {
        // No search, no filters - clear results
        setResults([]);
        setTotalResults(0);
        setLoading(false);
        return;
      }

      // Update state with results
      setResults(data.results || []);
      setTotalResults(data.total_results || 0);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch content whenever search, filters change
  useEffect(() => {
    fetchContent();
  }, [searchQuery, searchType, filterCounter, clearFiltersCounter]);

  return (
    <div className="home-container">
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
      />
      
      <div className="search-results">
        {/* Filter header with active filters - no sort options */}
        <FilterHeader />
        
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
        
        {!loading && !error && results.length > 0 && (
          <SearchResults 
            results={results} 
            searchType={searchType}
            searchQuery={searchQuery || 'Filtered Results'}
            totalResults={totalResults}
          />
        )}
        
        {!loading && !error && results.length === 0 && (searchQuery || isFilterActive) && (
          <div className="no-results">
            <h2>No Results Found</h2>
            <p>
              {searchQuery 
                ? `No ${searchType === 'movie' ? 'movies' : 'TV shows'} found matching "${searchQuery}"` 
                : 'Try adjusting your filters to see more content.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home