// TMDb API Service - Main entry point
// This file imports and re-exports all API services for backward compatibility

import {
  getImageUrl,
  getGenres,
  getGenreMapping,
  searchMovies,
  searchTvShows,
  getFilteredContent
} from './api';

// Re-export all services to maintain compatibility with existing code
export {
  getImageUrl,
  getGenres,
  getGenreMapping,
  searchMovies,
  searchTvShows,
  getFilteredContent
};

// If you're importing this file directly, consider updating your imports to use
// the modular API services instead:
// import { searchMovies, getGenres } from './api';