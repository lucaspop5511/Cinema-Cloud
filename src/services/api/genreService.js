// Genre Service for TMDb API
import { fetchFromApi } from './baseApi';

// TMDb API genre IDs for reference
export const GENRE_IDS = {
  // Movie genres
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
  
  // TV genres
  ACTION_ADVENTURE: 10759, // TV-specific
  KIDS: 10762, // TV-specific
  NEWS: 10763, // TV-specific
  REALITY: 10764, // TV-specific
  SCIFI_FANTASY: 10765, // TV-specific
  SOAP: 10766, // TV-specific
  TALK: 10767, // TV-specific
  WAR_POLITICS: 10768, // TV-specific
};

// Map our application genre names to TMDb genre IDs for both movies and TV
export const GENRE_MAPPING = {
  'Action': { movie: GENRE_IDS.ACTION, tv: GENRE_IDS.ACTION_ADVENTURE },
  'Adventure': { movie: GENRE_IDS.ADVENTURE, tv: GENRE_IDS.ACTION_ADVENTURE },
  'Animation': { movie: GENRE_IDS.ANIMATION, tv: GENRE_IDS.ANIMATION },
  'Comedy': { movie: GENRE_IDS.COMEDY, tv: GENRE_IDS.COMEDY },
  'Crime': { movie: GENRE_IDS.CRIME, tv: GENRE_IDS.CRIME },
  'Documentary': { movie: GENRE_IDS.DOCUMENTARY, tv: GENRE_IDS.DOCUMENTARY },
  'Drama': { movie: GENRE_IDS.DRAMA, tv: GENRE_IDS.DRAMA },
  'Family': { movie: GENRE_IDS.FAMILY, tv: GENRE_IDS.FAMILY },
  'Fantasy': { movie: GENRE_IDS.FANTASY, tv: GENRE_IDS.SCIFI_FANTASY },
  'History': { movie: GENRE_IDS.HISTORY, tv: GENRE_IDS.HISTORY },
  'Horror': { movie: GENRE_IDS.HORROR, tv: GENRE_IDS.HORROR },
  'Music': { movie: GENRE_IDS.MUSIC, tv: GENRE_IDS.MUSIC },
  'Mystery': { movie: GENRE_IDS.MYSTERY, tv: GENRE_IDS.MYSTERY },
  'Romance': { movie: GENRE_IDS.ROMANCE, tv: GENRE_IDS.ROMANCE },
  'Science Fiction': { movie: GENRE_IDS.SCIENCE_FICTION, tv: GENRE_IDS.SCIFI_FANTASY },
  'Thriller': { movie: GENRE_IDS.THRILLER, tv: GENRE_IDS.THRILLER },
  'War': { movie: GENRE_IDS.WAR, tv: GENRE_IDS.WAR_POLITICS },
  'Western': { movie: GENRE_IDS.WESTERN, tv: GENRE_IDS.WESTERN },
};

/**
 * Get genre list for movies or TV shows
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {Promise} - Promise with genre list
 */
export const getGenres = async (mediaType) => {
  try {
    const data = await fetchFromApi(`/genre/${mediaType}/list?language=en-US`);
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

/**
 * Map application genre names to TMDb genre IDs
 * @param {Array} genreNames - Array of genre names from the application
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {Array} - Array of TMDb genre IDs
 */
export const mapGenreNamesToIds = (genreNames, mediaType) => {
  if (!genreNames || !Array.isArray(genreNames)) return [];
  
  return genreNames
    .map(name => {
      // Check if the genre exists in our mapping
      if (GENRE_MAPPING[name] && GENRE_MAPPING[name][mediaType]) {
        return GENRE_MAPPING[name][mediaType];
      }
      return null;
    })
    .filter(id => id !== null);
};