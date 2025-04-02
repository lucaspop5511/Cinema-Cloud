// TMDb API Service

const API_KEY = '7c3176acaa14acc2e99f4b84f8c73781';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YzMxNzZhY2FhMTRhY2MyZTk5ZjRiODRmOGM3Mzc4MSIsIm5iZiI6MTc0MzU4NzAxMC4wNjA5OTk5LCJzdWIiOiI2N2VkMDZjMjhmZWQzZjAyMzZhYWU1NTgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.kTWh-vKzrU-QHAUgkVOh7hMvhcJX0Z3KPqJfRFsbs7I';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Search for movies by query
 * @param {string} query - Search term
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Promise with search results
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Search for TV shows by query
 * @param {string} query - Search term
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Promise with search results
 */
export const searchTvShows = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}&language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
};

/**
 * Get complete image URL from TMDb
 * @param {string} path - Image path from API
 * @returns {string} - Complete image URL
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${path}`;
};

/**
 * Get movie or TV show by genre
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Promise with results
 */
export const getByGenre = async (mediaType, genreId, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/${mediaType}?with_genres=${genreId}&page=${page}&language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting ${mediaType} by genre:`, error);
    throw error;
  }
};

/**
 * Get genre list for movies or TV shows
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {Promise} - Promise with genre list
 */
export const getGenres = async (mediaType) => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/${mediaType}/list?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error(`Error getting ${mediaType} genres:`, error);
    throw error;
  }
};