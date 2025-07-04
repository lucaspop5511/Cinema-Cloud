'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCinemaContent } from '../contexts/CinemaContentContext';
import '../styles/NowPlayingButton.css';

const NowPlayingButton = ({ mediaType, itemId, hideOnDetail = false }) => {
  const { isInCinema, isAiring, isLoaded } = useCinemaContent();
  const router = useRouter();
  
  if (!isLoaded) return null;
  if (hideOnDetail) return null;
  
  const isActive = mediaType === 'movie' 
    ? isInCinema(itemId) 
    : isAiring(itemId);
  
  if (!isActive) return null;
  
  const buttonText = mediaType === 'movie' ? 'Now in Cinemas' : 'Now Airing';
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/cinema');
  };
  
  return (
    <button 
      className={`now-playing-button icon-only`}
      onClick={handleClick}
      title={buttonText}
    >
      <span className="button-text">{buttonText}</span>
      <svg className="camera-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <g className="film-reel film-reel-1">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/>
          <circle cx="6" cy="6" r="1" fill="currentColor"/>
          <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1"/>
          <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1"/>
        </g>
        <g className="film-reel film-reel-2">
          <circle cx="14" cy="6" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/>
          <circle cx="14" cy="6" r="1" fill="currentColor"/>
          <line x1="14" y1="2" x2="14" y2="10" stroke="currentColor" strokeWidth="1"/>
          <line x1="10" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1"/>
        </g>
        <rect x="2" y="11" width="16" height="9" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="18.5" y="13" width="4" height="4.5" rx="0.5" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    </button>
  );
};

export default NowPlayingButton;