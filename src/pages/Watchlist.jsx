import React, { useState, useContext } from 'react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import { AppContext } from '../App';
import { getImageUrl } from '../services/api';
import { Link } from 'react-router-dom';
import '../styles/Watchlist.css';

const Watchlist = () => {
  const { currentUser } = useAuth();
  const { 
    watchlist, 
    removeFromWatchlist, 
    loading,
    getWatchlistByType 
  } = useWatchlist();
  
  const {
    selectedGenres,
    minYear,
    maxYear,
    minRuntime,
    maxRuntime,
    imdbRating,
    genreIdMapping,
    searchType,
    setSearchType
  } = useContext(AppContext);

  const [viewType, setViewType] = useState('all');

  if (!currentUser) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-not-logged-in">
          <h2>Please sign in to view your watchlist</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-loading">
          <p>Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  // Filter function to apply filters to watchlist items
  const applyFilters = (items) => {
    return items.filter(item => {
      // Genre filter
      if (selectedGenres.length > 0) {
        // For watchlist items, we need to check against the original genres
        // This is a simplified check - in a real app you'd want to store genre info
        const itemGenres = item.genres || [];
        const hasMatchingGenre = selectedGenres.some(selectedGenre => 
          itemGenres.some(genre => genre.name === selectedGenre)
        );
        if (!hasMatchingGenre) return false;
      }

      // Year filter
      if (item.release_date) {
        const year = new Date(item.release_date).getFullYear();
        if (year < minYear || year > maxYear) return false;
      }

      // IMDB rating filter
      if (imdbRating !== 'none' && item.vote_average) {
        switch (imdbRating) {
          case '<6':
            if (item.vote_average >= 6) return false;
            break;
          case '6-7':
            if (item.vote_average < 6 || item.vote_average >= 7) return false;
            break;
          case '7-8':
            if (item.vote_average < 7 || item.vote_average >= 8) return false;
            break;
          case '8+':
            if (item.vote_average < 8) return false;
            break;
        }
      }

      return true;
    });
  };

  // Get filtered items based on current filters and view type
  const getFilteredItems = () => {
    let items = watchlist;
    
    // Filter by media type if not viewing all
    if (viewType === 'movies') {
      items = getWatchlistByType('movie');
    } else if (viewType === 'tv') {
      items = getWatchlistByType('tv');
    }
    
    // Apply additional filters
    return applyFilters(items);
  };

  const handleRemove = async (item) => {
    await removeFromWatchlist(item.id, item.media_type);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };

  const handleMediaTypeChange = (type) => {
    setViewType(type);
    setSearchType(type === 'all' ? 'movie' : type === 'movies' ? 'movie' : 'tv');
  };

  const filteredItems = getFilteredItems();
  const movies = watchlist.filter(item => item.media_type === 'movie');
  const tvShows = watchlist.filter(item => item.media_type === 'tv');

  const renderItems = (items, showTitle = false) => (
    <>
      {showTitle && items.length > 0 && (
        <h3 className="section-title">
          {items[0].media_type === 'movie' ? 'Movies' : 'TV Shows'} ({items.length})
        </h3>
      )}
      {items.length === 0 ? (
        <p className="no-items">
          No {viewType === 'all' ? 'items' : viewType === 'movies' ? 'movies' : 'TV shows'} found with current filters.
        </p>
      ) : (
        <div className="watchlist-grid">
          {items.map(item => (
            <div key={`${item.media_type}_${item.id}`} className="watchlist-item">
              <Link 
                to={`/${item.media_type}/${item.id}`}
                className="watchlist-item-link"
              >
                <div className="watchlist-poster">
                  {item.poster_path ? (
                    <img src={getImageUrl(item.poster_path)} alt={item.title} />
                  ) : (
                    <div className="no-poster">No Poster</div>
                  )}
                </div>
                <div className="watchlist-info">
                  <h4 className="watchlist-title">{item.title}</h4>
                  <p className="watchlist-year">{formatDate(item.release_date)}</p>
                  {item.vote_average && (
                    <p className="watchlist-rating">★ {item.vote_average.toFixed(1)}</p>
                  )}
                </div>
              </Link>
              <button 
                className="remove-button"
                onClick={() => handleRemove(item)}
                title="Remove from watchlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p>Total items: {watchlist.length}</p>
        
        {/* Media Type Picker */}
        <div className="watchlist-media-picker">
          <button 
            className={`media-type-button ${viewType === 'all' ? 'active' : ''}`}
            onClick={() => handleMediaTypeChange('all')}
          >
            All
          </button>
          <button 
            className={`media-type-button ${viewType === 'movies' ? 'active' : ''}`}
            onClick={() => handleMediaTypeChange('movies')}
          >
            Movies ({movies.length})
          </button>
          <button 
            className={`media-type-button ${viewType === 'tv' ? 'active' : ''}`}
            onClick={() => handleMediaTypeChange('tv')}
          >
            TV Shows ({tvShows.length})
          </button>
        </div>
      </div>
      
      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <h2>Your watchlist is empty</h2>
          <p>Start adding movies and TV shows to build your personal collection!</p>
          <Link to="/" className="browse-link">Browse Movies & TV Shows</Link>
        </div>
      ) : (
        <div className="watchlist-content">
          {renderItems(filteredItems)}
        </div>
      )}
    </div>
  );
};

export default Watchlist;