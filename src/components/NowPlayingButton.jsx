'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCinemaContent } from '../contexts/CinemaContentContext';
import '../styles/NowPlayingButton.css';

const NowPlayingButton = ({ mediaType, itemId }) => {
  const { isInCinema, isAiring, isLoaded } = useCinemaContent();
  const router = useRouter();
  
  if (!isLoaded) return null;
  
  const isActive = mediaType === 'movie' 
    ? isInCinema(itemId) 
    : isAiring(itemId);
  
  if (!isActive) return null;
  
  const buttonText = mediaType === 'movie' ? 'Now in Cinemas' : 'Currently Airing';
  const buttonClass = mediaType === 'movie' ? 'cinema-button' : 'airing-button';
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/cinema');
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