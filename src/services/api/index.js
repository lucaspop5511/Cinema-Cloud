// Export all API services
import { fetchFromApi, getImageUrl } from './baseApi';
import { getGenres, getGenreMapping, mapGenreNamesToIds, GENRE_IDS, GENRE_MAPPING } from './genreService';
import { searchMovies, searchTvShows } from './searchService';
import { getFilteredContent } from './filterService';
import { filterContent } from './contentFilters';

export {
  // Base API
  fetchFromApi,
  getImageUrl,
  
  // Genre Service
  getGenres,
  getGenreMapping,
  mapGenreNamesToIds,
  GENRE_IDS,
  GENRE_MAPPING,
  
  // Search Service
  searchMovies,
  searchTvShows,
  
  // Filter Service
  getFilteredContent,
  
  // Content Filters
  filterContent
};