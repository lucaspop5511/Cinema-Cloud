'use client'

import React, { useState, useContext, useEffect } from 'react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import { AppContext } from '../components/AppWrapper';
import { getImageUrl, fetchFromApi } from '../services/api';
import Link from 'next/link';
import NowPlayingButton from '../components/NowPlayingButton';
import '../styles/Watchlist.css';
import '../styles/NowPlayingButton.css';

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
    searchType,
    setSearchType
  } = useContext(AppContext);

  const [viewType, setViewType] = useState('all');
  const [detailedItems, setDetailedItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchDetailedInfo = async () => {
      if (watchlist.length === 0) return;

      setLoadingDetails(true);
      try {
        const detailedPromises = watchlist.map(async (item) => {
          try {
            const details = await fetchFromApi(`/${item.media_type}/${item.id}?language=en-US`);
            return {
              ...item,
              overview: details.overview,
              genres: details.genres || [],
              runtime: item.media_type === 'movie' 
                ? details.runtime 
                : (details.episode_run_time && details.episode_run_time.length > 0 
                   ? Math.max(...details.episode_run_time) 
                   : 0),
              vote_average: details.vote_average,
              status: details.status,
              last_air_date: details.last_air_date,
              release_date: details.release_date || item.release_date 
            };
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type} ${item.id}:`, error);
            return item; 
          }
        });

        const detailedResults = await Promise.all(detailedPromises);
        setDetailedItems(detailedResults);
      } catch (error) {
        console.error('Error fetching detailed info:', error);
        setDetailedItems(watchlist);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetailedInfo();
  }, [watchlist]);

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

  const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const getTitle = (item) => {
    return item.media_type === 'movie' ? item.title : item.name || item.title;
  };

  const getReleaseDate = (item) => {
    return item.release_date;
  };
  
  const getOverview = (item) => {
    if (!item.overview || item.overview.trim() === '') {
      return item.media_type === 'movie' 
        ? 'No description available for this movie.' 
        : 'No description available for this TV show.';
    }
    
    const CHARACTER_LIMIT = 150;
    
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

  const applyFilters = (items) => {
    return items.filter(item => {
      if (selectedGenres.length > 0 && item.genres) {
        const itemGenreNames = item.genres.map(genre => genre.name);
        const hasMatchingGenre = selectedGenres.some(selectedGenre => 
          itemGenreNames.includes(selectedGenre)
        );
        if (!hasMatchingGenre) return false;
      }

      if (item.release_date) {
        const year = new Date(item.release_date).getFullYear();
        if (year < minYear || year > maxYear) return false;
      }

      if (item.runtime) {
        if (item.runtime < minRuntime || item.runtime > maxRuntime) return false;
      }

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

  const getFilteredItems = () => {
    const items = detailedItems.length > 0 ? detailedItems : watchlist;
    
    let filteredByType = items;
    
    if (viewType === 'movies') {
      filteredByType = items.filter(item => item.media_type === 'movie');
    } else if (viewType === 'tv') {
      filteredByType = items.filter(item => item.media_type === 'tv');
    }
    
    return applyFilters(filteredByType);
  };

  const handleRemove = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    await removeFromWatchlist(item.id, item.media_type);
  };

  const handleMediaTypeChange = (type) => {
    setViewType(type);
    setSearchType(type === 'all' ? 'movie' : type === 'movies' ? 'movie' : 'tv');
  };

  const filteredItems = getFilteredItems();
  const movies = watchlist.filter(item => item.media_type === 'movie');
  const tvShows = watchlist.filter(item => item.media_type === 'tv');

  const renderItems = (items) => {
    if (loadingDetails) {
      return (
        <div className="loading-indicator">
          <p>Loading movie details...</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="no-results">
          <h2>No Results Found</h2>
          <p>
            No {viewType === 'all' ? 'items' : viewType === 'movies' ? 'movies' : 'TV shows'} found with current filters.
          </p>
          <p>Try adjusting your filters to see more content.</p>
        </div>
      );
    }

    return (
      <div className="results-grid">
        {items.map(item => (
          <Link 
            key={`${item.media_type}_${item.id}`} 
            href={`/${item.media_type}/${item.id}`}
            className="result-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="result-poster">
              {item.poster_path ? (
                <img src={getImageUrl(item.poster_path)} alt={getTitle(item)} />
              ) : (
                <div className="no-poster">No Poster</div>
              )}
              <button 
                className="remove-from-watchlist-btn left-positioned"
                onClick={(e) => handleRemove(e, item)}
                title="Remove from watchlist"
              >
                ✕
              </button>
              
              <NowPlayingButton 
                mediaType={item.media_type} 
                itemId={item.id} 
              />
            </div>
            
            <div className="result-info">
              <div className="result-info-header">
                <h3 className="result-title">{getTitle(item)}</h3>
                <div className="result-details">
                  <span className="result-year">{getYear(getReleaseDate(item))}</span>
                  {item.runtime && item.runtime > 0 && (
                    <>
                      •
                      <div className="result-runtime-display">
                        {item.media_type === 'tv' ? `${formatRuntime(item.runtime)} / episode` : formatRuntime(item.runtime)}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="result-rating">
                  <span className="rating-value">
                    {item.vote_average ? (item.vote_average.toFixed(1) + '/10') : 'No rating'}
                  </span>
                </div>
              </div>
              
              <div className="result-content-divider"></div>
              
              <p className="result-overview">
                {getOverview(item)}
                <span className="see-more-button-inline">
                  see more
                </span>
              </p>
              <div className="result-id" style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                ID: {item.id}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p>Total items: {watchlist.length}</p>
        
        <div className="media-type-picker">
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
          <Link href="/" className="browse-link">Browse Movies & TV Shows</Link>
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