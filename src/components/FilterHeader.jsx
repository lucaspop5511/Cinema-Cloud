import { useContext } from 'react';
import { AppContext } from '../App';
import '../styles/panels/FilterHeader.css';

function FilterHeader() {
  const { 
    selectedGenres, 
    minYear, 
    maxYear, 
    minRuntime,
    maxRuntime,
    contentRatings,
    clearFilters,
    isFilterActive,
    searchType
  } = useContext(AppContext);

  // Format runtime for display
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

  // Check if we have any active filters
  const hasActiveFilters = selectedGenres.length > 0 || 
                          minYear !== 1990 || 
                          maxYear !== new Date().getFullYear() ||
                          minRuntime !== 0 ||
                          maxRuntime !== 240 ||
                          contentRatings.length > 0;

  return (
    <div className="filter-header">
      {hasActiveFilters && isFilterActive && (
        <div className="active-filters">
          <h3>Active Filters:</h3>
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
            
            {contentRatings.length > 0 && (
              <div className="filter-tag-group">
                <span className="filter-tag-label">Rating:</span>
                {contentRatings.map(rating => (
                  <span key={rating} className="filter-tag">{rating}</span>
                ))}
              </div>
            )}
            
            <button 
              type="button" 
              className="clear-filters-btn" 
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterHeader;