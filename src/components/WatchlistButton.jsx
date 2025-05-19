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

    console.log('WatchlistButton clicked', { itemId: item.id, mediaType, inWatchlist });

    try {
      if (inWatchlist) {
        console.log('Removing from watchlist...');
        const success = await removeFromWatchlist(item.id, mediaType);
        console.log('Remove result:', success);
      } else {
        console.log('Adding to watchlist...', item);
        const success = await addToWatchlist(item, mediaType);
        console.log('Add result:', success);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  // IMDB-style bookmark icon SVG
  const BookmarkIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill={inWatchlist ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className="bookmark-icon"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
    </svg>
  );

  return (
    <button
      className={`watchlist-button ${inWatchlist ? 'in-watchlist' : ''} ${className}`}
      onClick={handleClick}
      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      <BookmarkIcon />
    </button>
  );
};

export default WatchlistButton;