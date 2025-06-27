'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchFromApi } from '../services/api';

// Context to track content that is in the Cinema page
const CinemaContentContext = createContext({
  cinemaMovieIds: [],
  airingShowIds: [],
  isInCinema: () => false,
  isAiring: () => false,
  loadCinemaContent: () => {},
  isLoaded: false
});

export const CinemaContentProvider = ({ children }) => {
  const [cinemaMovieIds, setCinemaMovieIds] = useState([]);
  const [airingShowIds, setAiringShowIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const isInCinema = (movieId) => {
    return cinemaMovieIds.includes(Number(movieId));
  };

  const isAiring = (showId) => {
    return airingShowIds.includes(Number(showId));
  };

  const loadCinemaContent = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const moviesResponse = await fetchFromApi('/movie/now_playing?language=en-US&region=RO&page=1');
      const movieIds = moviesResponse.results.map(movie => movie.id);
      setCinemaMovieIds(movieIds);
      
      const tvResponse = await fetchFromApi('/tv/on_the_air?language=en-US&page=1');
      const tvIds = tvResponse.results.map(show => show.id);
      setAiringShowIds(tvIds);
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading cinema content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cinema content on component mount
  useEffect(() => {
    loadCinemaContent();
  }, []);

  return (
    <CinemaContentContext.Provider 
      value={{ 
        cinemaMovieIds, 
        airingShowIds, 
        isInCinema, 
        isAiring,
        loadCinemaContent,
        isLoaded
      }}
    >
      {children}
    </CinemaContentContext.Provider>
  );
};

export const useCinemaContent = () => {
  const context = useContext(CinemaContentContext);
  if (!context) {
    throw new Error('useCinemaContent must be used within a CinemaContentProvider');
  }
  return context;
};

export default CinemaContentContext;