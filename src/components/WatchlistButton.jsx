import React from 'react';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/WatchlistButton.css';

const WatchlistButton = ({ item, mediaType, className = '' }) => {
  const { currentUser } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Don't show button if user is not logged in
  if (!currentUser) return null;

  const inWatchlist = isInWatchlist(item.id, mediaType);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWatchlist) {
      await removeFromWatchlist(item.id, mediaType);
    } else {
      await addToWatchlist(item, mediaType);
    }
  };

  return (
    <button
      className={`watchlist-button ${inWatchlist ? 'in-watchlist' : ''} ${className}`}
      onClick={handleClick}
      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      {inWatchlist ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      )}
    </button>
  );
};

export default WatchlistButton;