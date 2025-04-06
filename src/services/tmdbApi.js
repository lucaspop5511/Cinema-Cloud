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
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=en-US&include_adult=false&sort_by=popularity.desc`,
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
      `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}&language=en-US&include_adult=false&sort_by=popularity.desc`,
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
 * Get movie or TV show by filters
 * @param {Object} filters - Filter options
 * @param {string} filters.mediaType - 'movie' or 'tv'
 * @param {Array} filters.genres - Array of genre IDs
 * @param {number} filters.minYear - Minimum release year
 * @param {number} filters.maxYear - Maximum release year
 * @param {number} filters.minRuntime - Minimum runtime in minutes
 * @param {number} filters.maxRuntime - Maximum runtime in minutes
 * @param {Array} filters.contentRatings - Array of content ratings
 * @param {string} filters.query - Optional search query to combine with filters
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} - Promise with results
 */
export const getFilteredContent = async (filters, page = 1) => {
  try {
    // Convert year to TMDB date format
    const minDate = `${filters.minYear}-01-01`;
    const maxDate = `${filters.maxYear}-12-31`;
    
    // If there's a search query, we need to handle it in a special way
    if (filters.query) {
      // First get search results
      let searchResults;
      if (filters.mediaType === 'movie') {
        searchResults = await searchMovies(filters.query, page);
      } else {
        searchResults = await searchTvShows(filters.query, page);
      }
      
      // Filter the search results client-side
      let filteredResults = searchResults.results || [];
      
      if (filteredResults.length > 0) {
        // Filter by year
        filteredResults = filteredResults.filter(item => {
          const releaseDate = filters.mediaType === 'movie' 
            ? item.release_date 
            : item.first_air_date;
          
          if (!releaseDate) return false;
          
          const releaseYear = new Date(releaseDate).getFullYear();
          return releaseYear >= filters.minYear && releaseYear <= filters.maxYear;
        });
        
        // Filter by genre if needed
        if (filters.genres && filters.genres.length > 0) {
          filteredResults = filteredResults.filter(item => {
            if (!item.genre_ids || item.genre_ids.length === 0) return false;
            
            return item.genre_ids.some(genreId => filters.genres.includes(genreId));
          });
        }
        
        // Sort by popularity (based on vote_count)
        filteredResults.sort((a, b) => b.vote_count - a.vote_count);
      }
      
      return {
        results: filteredResults,
        total_results: filteredResults.length,
        page: 1,
        total_pages: 1
      };
    }
    
    // Build query parameters for direct API call (no search query)
    let queryParams = [
      `page=${page}`,
      'language=en-US',
      'include_adult=false',
      `with_runtime.gte=${filters.minRuntime}`,
      `with_runtime.lte=${filters.maxRuntime}`,
      'sort_by=popularity.desc' // Always sort by popularity
    ];
    
    // Date filter depends on media type
    if (filters.mediaType === 'movie') {
      queryParams.push(`primary_release_date.gte=${minDate}`);
      queryParams.push(`primary_release_date.lte=${maxDate}`);
    } else {
      queryParams.push(`first_air_date.gte=${minDate}`);
      queryParams.push(`first_air_date.lte=${maxDate}`);
    }
    
    // Add genres if selected
    if (filters.genres && filters.genres.length > 0) {
      queryParams.push(`with_genres=${filters.genres.join(',')}`);
    }
    
    // Add certification filter if provided
    if (filters.contentRatings && filters.contentRatings.length > 0) {
      if (filters.mediaType === 'movie') {
        queryParams.push(`certification_country=US`);
        queryParams.push(`certification.in=${filters.contentRatings.join('|')}`);
      }
    }
    
    const queryString = queryParams.join('&');
    const response = await fetch(
      `${BASE_URL}/discover/${filters.mediaType}?${queryString}`,
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
    console.error(`Error getting filtered content:`, error);
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

/**
 * Get genre name to ID mapping
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {Promise} - Promise with genre mapping object
 */
export const getGenreMapping = async (mediaType) => {
  const genres = await getGenres(mediaType);
  const mapping = {};
  // Create name-to-id mappings
  genres.forEach(genre => {
    mapping[genre.name] = genre.id;
  });
  return mapping;
};