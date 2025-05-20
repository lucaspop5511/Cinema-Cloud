import { getImageUrl } from '../services/api';
import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';
import NowPlayingButton from './NowPlayingButton';

function SearchResults({ 
  results, 
  searchType, 
  searchQuery, 
  totalResults = 0,
  page = 1,
  totalPages = 1,
  onLoadMore,
  isLoadingMore = false 
}) {
  const MINIMUM_VOTE_COUNT = 10; // Lower threshold to show more results
  
  // Get release year from date string
  const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  // Get title based on media type
  const getTitle = (item) => {
    return searchType === 'movie' ? item.title : item.name;
  };

  // Get release date based on media type
  const getReleaseDate = (item) => {
    return searchType === 'movie' ? item.release_date : item.first_air_date;
  };
  
  // Get and format overview text with character limit for all cards
  const getOverview = (item) => {
    if (!item.overview || item.overview.trim() === '') {
      return searchType === 'movie' 
        ? 'No description available for this movie.' 
        : 'No description available for this TV show.';
    }
    
    // Limit to 150 characters for all descriptions
    const CHARACTER_LIMIT = 200;
    
    // Always truncate to ensure consistent look with "see more" button
    const lastSpace = item.overview.lastIndexOf(' ', CHARACTER_LIMIT);
    const cutPoint = lastSpace > 0 ? lastSpace : CHARACTER_LIMIT;
    
    return item.overview.substring(0, cutPoint) + (item.overview.length > CHARACTER_LIMIT ? '...' : '');
  };
  
  // Format runtime information
  const formatRuntime = (runtime) => {
    if (!runtime || runtime <= 0) return '';
    
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };
  
  // Check if runtime is valid and available
  const hasValidRuntime = (item) => {
    if (!item) return false;
    
    // For TV shows, check multiple sources of runtime information
    if (searchType === 'tv') {
      // Check episode_run_time array
      if (item.episode_run_time && 
          Array.isArray(item.episode_run_time) && 
          item.episode_run_time.length > 0 &&
          item.episode_run_time[0] > 0) {
        return true;
      }
      
      // Check seasons for average runtime
      if (item.seasons && item.avg_runtime && item.avg_runtime > 0) {
        return true;
      }
      
      // Check for directly assigned runtime
      if (item.runtime && item.runtime > 0) {
        return true;
      }
      
      return false;
    }
    
    // For movies, just check the runtime field
    return item.runtime && item.runtime > 0;
  };
  
  // Get the actual runtime value to display
  const getRuntimeValue = (item) => {
    if (!item) return 0;
    
    if (searchType === 'tv') {
      // Try episode_run_time array first
      if (item.episode_run_time && 
          Array.isArray(item.episode_run_time) && 
          item.episode_run_time.length > 0) {
        return Math.max(...item.episode_run_time);
      }
      
      // Try average runtime
      if (item.avg_runtime) {
        return item.avg_runtime;
      }
      
      // Fallback to direct runtime
      return item.runtime || 0;
    }
    
    // For movies, just return the runtime field
    return item.runtime || 0;
  };
  
  // Get formatted runtime with appropriate label
  const getFormattedRuntime = (item) => {
    if (!hasValidRuntime(item)) {
      return '';
    }
    
    const runtime = getRuntimeValue(item);
    
    if (searchType === 'tv') {
      return `${formatRuntime(runtime)} / episode`;
    } else {
      return formatRuntime(runtime);
    }
  };

  // Handle case where there are no results
  if (results.length === 0) {
    return (
      <div className="results-container">
        <div className="results-header">
          <h2 className="results-query">{searchQuery}</h2>
          <span className="results-count">(No results found)</span>
        </div>
        <div className="no-results">
          <p>No {searchType === 'movie' ? 'movies' : 'TV shows'} found matching your criteria</p>
        </div>
      </div>
    );
  }

  // Filter out results with insufficient vote count and ensure runtime filter is applied
  const filteredResults = results.filter(item => {
    // Check minimum vote count
    if (item.vote_count < MINIMUM_VOTE_COUNT) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-query">{searchQuery}</h2>
        {/* <span className="results-count">
          ({filteredResults.length} {searchType === 'movie' ? 'movies' : 'TV shows'} found
          {totalResults > filteredResults.length ? ` of ${totalResults} total` : ''})
        </span> */}
      </div>
      
      <div className="results-grid">
        {filteredResults.map(item => (
          <Link 
            key={item.id} 
            to={`/${searchType}/${item.id}`}
            className="result-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="result-poster">
              {item.poster_path ? (
                <img src={getImageUrl(item.poster_path)} alt={getTitle(item)} />
              ) : (
                <div className="no-poster">No Poster</div>
              )}
              {/* Watchlist Button */}
              <WatchlistButton item={item} mediaType={searchType} />
              
              {/* Now Playing/Currently Airing Button */}
              <NowPlayingButton 
                mediaType={searchType} 
                itemId={item.id}
              />
            </div>
            
            {/* Single expandable info section that overlays the image */}
            <div className="result-info">
              {/* Static header info (always visible) */}
              <div className="result-info-header">
                <h3 className="result-title">{getTitle(item)}</h3>
                <div className="result-details">
                  <span className="result-year">{getYear(getReleaseDate(item))}</span>
                  {hasValidRuntime(item) && (
                    <>
                      •
                      <div className="result-runtime-display">
                        {getFormattedRuntime(item)}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Rating is now always visible */}
                <div className="result-rating">
                  <span className="rating-value">
                    {item.vote_average ? (item.vote_average.toFixed(1) + '/10') : 'No rating'}
                  </span>
                </div>
              </div>
              
              {/* Divider line */}
              <div className="result-content-divider"></div>
              
              {/* Content that appears on hover */}
              <p className="result-overview">
                {getOverview(item)}
                <span className="see-more-button-inline">
                  see more
                </span>
              </p>
              <div className="result-id" style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                ID: {item.id}
                {item.runtime !== undefined && (
                  <span> | Runtime: {item.runtime}m</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Load More Button */}
      {page < totalPages && onLoadMore && (
        <div className="load-more-container">
          <button 
            className="load-more-button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchResults;