import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCinemaContent } from '../contexts/CinemaContentContext';
import '../styles/NowPlayingButton.css';

const NowPlayingButton = ({ mediaType, itemId }) => {
  const { isInCinema, isAiring, isLoaded } = useCinemaContent();
  const navigate = useNavigate();
  
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
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/cinema');
  };
  
  // Use a button instead of a Link to avoid nesting <a> tags
  return (
    <button 
      className={`now-playing-button ${buttonClass}`}
      onClick={handleClick}
    >
      {buttonText}
    </button>
  );
};

export default NowPlayingButton;