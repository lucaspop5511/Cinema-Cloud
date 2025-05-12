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
          data = await getFilteredContent(filterParams, page);
        } else {
          // Just search without filters
          if (searchType === 'movie') {
            data = await searchMovies(searchQuery, page);
          } else {
            data = await searchTvShows(searchQuery, page);
          }
        }
      } else if (hasFilters) {
        // If we have filters but no search query, use discover API
        data = await getFilteredContent(filterParams, page);
      } else {
        // No search, no filters - clear results
        setResults([]);
        setTotalResults(0);
        setCurrentPage(1);
        setTotalPages(1);
        setLoading(false);
        setIsLoadingMore(false);
        return;
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
            searchQuery={searchQuery || 'Filtered Results'}
            totalResults={totalResults}
            page={currentPage}
            totalPages={totalPages}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
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