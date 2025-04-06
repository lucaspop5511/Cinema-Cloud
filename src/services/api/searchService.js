// Search Service for TMDb API
import { fetchFromApi } from './baseApi';
import { filterContent } from './contentFilters';

/**
 * Search for movies by query
 * @param {string} query - Search term
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Promise with search results
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const data = await fetchFromApi(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=en-US&include_adult=false&sort_by=popularity.desc`
    );
    
    // Apply additional content filtering
    if (data.results && Array.isArray(data.results)) {
      data.results = filterContent(data.results);
      
      // Update total_results count
      data.total_results = data.results.length;
    }
    
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
    const data = await fetchFromApi(
      `/search/tv?query=${encodeURIComponent(query)}&page=${page}&language=en-US&include_adult=false&sort_by=popularity.desc`
    );
    
    // Apply additional content filtering
    if (data.results && Array.isArray(data.results)) {
      data.results = filterContent(data.results, {
        excludeTalkShows: true // Explicitly exclude talk shows
      });
      
      // Update total_results count
      data.total_results = data.results.length;
    }
    
    return data;
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
};