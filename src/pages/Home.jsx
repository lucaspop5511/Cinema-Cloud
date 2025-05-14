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
        return { min: 8, max: 10 };
      default:
        return null; // 'none' returns null which means no rating filter
    }
  };

  // Check if any non-default filters are applied
  const hasActiveFilters = () => {
    return selectedGenres.length > 0 || 
           minYear !== 1990 || 
           maxYear !== new Date().getFullYear() ||
           minRuntime !== 0 ||
           maxRuntime !== 240 ||
           imdbRating !== 'none';
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
      
      // Convert selected genre names to IDs
      const genreIds = selectedGenres.map(genre => genreIdMapping[genre]).filter(id => id);
      
      // Always use getFilteredContent which now handles both search and filters
      const filterParams = {
        mediaType: searchType,
        genres: genreIds,
        minYear,
        maxYear,
        minRuntime,
        maxRuntime,
        sortBy: 'popularity',
        imdbRating: ratingRange,
        query: searchQuery?.trim() || null // Pass search query to filter service
      };

      console.log('Fetching content with params:', filterParams);
      data = await getFilteredContent(filterParams, page);

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
      
      // Set filter as active if we have any filters (including search)
      if (hasActiveFilters() || (searchQuery && searchQuery.trim() !== '')) {
        setIsFilterActive(true);
      }
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

  // Fetch content whenever search, filters change, or clear filters
  useEffect(() => {
    console.log('Home useEffect triggered - fetchContent');
    fetchContent();
  }, [searchQuery, searchType, filterCounter, clearFiltersCounter]);

  // Handle media type changes when filters are active
  useEffect(() => {
    // Only run if we've changed media type and have active filters
    if (
      previousSearchType && 
      previousSearchType !== searchType && 
      (isFilterActive || hasActiveFilters())
    ) {
      console.log('Media type changed with active filters, applying filters');
      // Automatically apply filters when switching media types
      applyFilters();
    }
    
    // Update previous search type for next comparison
    setPreviousSearchType(searchType);
  }, [searchType]);

  // Clear results when search query is completely empty and no filters
  useEffect(() => {
    if (!searchQuery?.trim() && !hasActiveFilters() && !isFilterActive) {
      console.log('No search query and no filters, clearing results');
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
      setCurrentPage(1);
    }
  }, [searchQuery, selectedGenres, minYear, maxYear, minRuntime, maxRuntime, imdbRating]);

  // Determine display query for results
  const getDisplayQuery = () => {
    if (searchQuery && searchQuery.trim() !== '') {
      return hasActiveFilters() 
        ? `"${searchQuery}" with filters` 
        : searchQuery;
    } else if (hasActiveFilters()) {
      return 'Filtered Results';
    }
    return 'Popular Results';
  };

  return (
    <div className="home-container">
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
      />
      
      <div className="search-results">
        {/* Filter header with active filters */}
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
            searchQuery={getDisplayQuery()}
            totalResults={totalResults}
            page={currentPage}
            totalPages={totalPages}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
          />
        )}
        
        {!loading && !error && results.length === 0 && (searchQuery?.trim() || hasActiveFilters()) && (
          <div className="no-results">
            <h2>No Results Found</h2>
            <p>
              {searchQuery?.trim() && hasActiveFilters()
                ? `No ${searchType === 'movie' ? 'movies' : 'TV shows'} found matching "${searchQuery}" with the applied filters`
                : searchQuery?.trim()
                ? `No ${searchType === 'movie' ? 'movies' : 'TV shows'} found matching "${searchQuery}"`
                : 'No results found with the applied filters'}
            </p>
            <p>Try adjusting your search terms or filters to see more content.</p>
          </div>
        )}
        
        {!loading && !error && results.length === 0 && !searchQuery?.trim() && !hasActiveFilters() && (
          <div className="no-results">
            <h2>Start Your Search</h2>
            <p>Use the search bar above or apply filters to discover {searchType === 'movie' ? 'movies' : 'TV shows'}.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home