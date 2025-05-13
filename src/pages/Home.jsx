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
    imdbRating,
    isFilterActive,
    setIsFilterActive,
    genreIdMapping,
    filterCounter,
    clearFiltersCounter,
    applyFilters,
    previousSearchType,
    setPreviousSearchType
  } = useContext(AppContext)
  
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Convert IMDB rating to min/max values
  const getImdbRatingRange = () => {
    switch (imdbRating) {
      case '<6':
        return { min: 0, max: 6 };
      case '6-7':
        return { min: 6, max: 7 };
      case '7-8':
        return { min: 7, max: 8 };
      case '8+':
        return { min: 8, max: 10 }; // Changed to 8+ with no upper limit except 10
      default:
        return null; // 'none' returns null which means no rating filter
    }
  };

  // Function to fetch content based on current state
  const fetchContent = async (page = 1, append = false) => {
    if (!append) {
      setLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let data;
      const ratingRange = getImdbRatingRange();
      
      // Check if we have any filters applied (including IMDB rating when it's not 'none')
      const hasNonDefaultFilters = selectedGenres.length > 0 || 
                         minYear !== 1990 || 
                         maxYear !== new Date().getFullYear() ||
                         minRuntime !== 0 ||
                         maxRuntime !== 240 ||
                         imdbRating !== 'none';

      // Convert selected genre names to IDs
      const genreIds = selectedGenres.map(genre => genreIdMapping[genre]).filter(id => id);
      
      // Always use the discover API if we have any filters (including IMDB rating)
      // or if we don't have a search query
      if (!searchQuery.trim() || hasNonDefaultFilters) {
        // Prepare filters object for discover API
        const filterParams = {
          mediaType: searchType,
          genres: genreIds,
          minYear,
          maxYear,
          minRuntime,
          maxRuntime,
          sortBy: 'popularity',
          imdbRating: ratingRange
          // No longer have minVoteCount requirements
        };

        console.log('Using discover API with filters:', filterParams);
        data = await getFilteredContent(filterParams, page);
      } else {
        // Use search API for query-based searches without filters
        if (searchType === 'movie') {
          data = await searchMovies(searchQuery, page);
        } else {
          data = await searchTvShows(searchQuery, page);
        }
      }

      // Update state with results
      const newResults = data.results || [];
      
      if (append) {
        setResults(prevResults => [...prevResults, ...newResults]);
      } else {
        setResults(newResults);
        setCurrentPage(1);
      }
      
      setTotalResults(data.total_results || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load more results
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
      fetchContent(nextPage, true);
    }
  };

  // Fetch content whenever search, filters change
  useEffect(() => {
    fetchContent();
  }, [searchQuery, searchType, filterCounter, clearFiltersCounter]);

  // Handle media type changes when filters are active
  useEffect(() => {
    // Only run if we've changed media type and have active filters
    if (
      previousSearchType && 
      previousSearchType !== searchType && 
      isFilterActive
    ) {
      // Automatically apply filters when switching media types
      applyFilters();
    }
    
    // Update previous search type for next comparison
    setPreviousSearchType(searchType);
  }, [searchType]);

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
            searchQuery={searchQuery || 'Popular Results'}
            totalResults={totalResults}
            page={currentPage}
            totalPages={totalPages}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
          />
        )}
        
        {!loading && !error && results.length === 0 && (
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