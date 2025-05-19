import React from 'react';
import { Link } from 'react-router-dom';
import { useCinemaContent } from '../contexts/CinemaContentContext';
import '../styles/NowPlayingButton.css';

const NowPlayingButton = ({ mediaType, itemId }) => {
  const { isInCinema, isAiring, isLoaded } = useCinemaContent();
  
  // Don't render until cinema content is loaded
  if (!isLoaded) return null;
  
  // Check if this specific item is in cinema or airing
  const isActive = mediaType === 'movie' 
    ? isInCinema(itemId) 
    : isAiring(itemId);
  
  // If not active, don't show button
  if (!isActive) return null;
  
  const buttonText = mediaType === 'movie' ? 'Now in Cinemas' : 'Currently Airing';
  const buttonClass = mediaType === 'movie' ? 'cinema-button' : 'airing-button';
  
  return (
    <Link 
      to="/cinema" 
      className={`now-playing-button ${buttonClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      {buttonText}
    </Link>
  );
};

export default NowPlayingButton;