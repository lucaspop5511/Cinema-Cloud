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
  const MINIMUM_VOTE_COUNT = 10; 
  
  const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const getTitle = (item) => {
    return searchType === 'movie' ? item.title : item.name;
  };

  const getReleaseDate = (item) => {
    return searchType === 'movie' ? item.release_date : item.first_air_date;
  };
  
  const getOverview = (item) => {
    if (!item.overview || item.overview.trim() === '') {
      return searchType === 'movie' 
        ? 'No description available for this movie.' 
        : 'No description available for this TV show.';
    }
    
    const CHARACTER_LIMIT = 150;
    
    // Truncate
    const lastSpace = item.overview.lastIndexOf(' ', CHARACTER_LIMIT);
    const cutPoint = lastSpace > 0 ? lastSpace : CHARACTER_LIMIT;
    
    return item.overview.substring(0, cutPoint) + (item.overview.length > CHARACTER_LIMIT ? '...' : '');
  };
  
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
  
  const hasValidRuntime = (item) => {
    if (!item) return false;
    
    // For TV shows check multiple sources of runtime information
    if (searchType === 'tv') {
      if (item.episode_run_time && 
          Array.isArray(item.episode_run_time) && 
          item.episode_run_time.length > 0 &&
          item.episode_run_time[0] > 0) {
        return true;
      }
      
      if (item.seasons && item.avg_runtime && item.avg_runtime > 0) {
        return true;
      }
      
      if (item.runtime && item.runtime > 0) {
        return true;
      }
      
      return false;
    }
    
    return item.runtime && item.runtime > 0;
  };
  
  const getRuntimeValue = (item) => {
    if (!item) return 0;
    
    if (searchType === 'tv') {
      if (item.episode_run_time && 
          Array.isArray(item.episode_run_time) && 
          item.episode_run_time.length > 0) {
        return Math.max(...item.episode_run_time);
      }
      if (item.avg_runtime) {
        return item.avg_runtime;
      }
      return item.runtime || 0;
    }
    
    return item.runtime || 0;
  };
  
  // Get formatted runtime 
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

  // No results
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