import { useContext } from 'react';
import { AppContext } from './AppWrapper';
import '../styles/panels/FilterHeader.css';

function FilterHeader() {
  const { 
    selectedGenres, 
    minYear, 
    maxYear, 
    minRuntime,
    maxRuntime,
    imdbRating,
    clearFilters,
    isFilterActive,
    searchType,
    searchQuery
  } = useContext(AppContext);

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  // Get IMDB rating label
  const getImdbRatingLabel = () => {
    const ratingMap = {
      'none': null,
      '<6': '< 6',
      '6-7': '6-7',
      '7-8': '7-8',
      '8+': '8+'
    };
    return ratingMap[imdbRating];
  };

  // Check if we have any active filters
  const hasActiveFilters = selectedGenres.length > 0 || 
                          minYear !== 1990 || 
                          maxYear !== new Date().getFullYear() ||
                          minRuntime !== 0 ||
                          maxRuntime !== 240 ||
                          imdbRating !== 'none';

  return (
    <div className="filter-header">
      {hasActiveFilters && isFilterActive && (
        <div className="active-filters">
          <h3>Active Filters{searchQuery && searchQuery.trim() ? ` for "${searchQuery}"` : ''}:</h3>
          <div className="filter-tags">
            {selectedGenres.length > 0 && (
              <div className="filter-tag-group">
                <span className="filter-tag-label">Genres:</span>
                {selectedGenres.map(genre => (
                  <span key={genre} className="filter-tag">{genre}</span>
                ))}
              </div>
            )}
            
            {(minYear !== 1990 || maxYear !== new Date().getFullYear()) && (
              <div className="filter-tag-group">
                <span className="filter-tag-label">Year:</span>
                <span className="filter-tag">{minYear} - {maxYear}</span>
              </div>
            )}
            
            {(minRuntime !== 0 || maxRuntime !== 240) && (
              <div className="filter-tag-group">
                <span className="filter-tag-label">
                  {searchType === 'tv' ? 'Episode Runtime:' : 'Runtime:'}
                </span>
                <span className="filter-tag">{formatRuntime(minRuntime)} - {formatRuntime(maxRuntime)}</span>
              </div>
            )}
            
            {imdbRating !== 'none' && (
              <div className="filter-tag-group">
                <span className="filter-tag-label">IMDB Rating:</span>
                <span className="filter-tag">{getImdbRatingLabel()}</span>
              </div>
            )}
            
            <button 
              type="button" 
              className="clear-filters-btn" 
              onClick={clearFilters}
              title={searchQuery && searchQuery.trim() ? "Clear filters and show all search results" : "Clear all filters"}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterHeader;