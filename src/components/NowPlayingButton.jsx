import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCinemaContent } from '../contexts/CinemaContentContext';
import '../styles/NowPlayingButton.css';

const NowPlayingButton = ({ mediaType, itemId }) => {
  const { isInCinema, isAiring, isLoaded } = useCinemaContent();
  const navigate = useNavigate();
  
  if (!isLoaded) return null;
  
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