const fetch = require('node-fetch');

const TMDB_API_KEY = '7c3176acaa14acc2e99f4b84f8c73781'; // Your existing key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

class TMDbService {
  async searchMovie(title, year = null) {
    try {
      // First, try searching with the Romanian title
      let searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=en-US`;
      
      if (year) {
        searchUrl += `&year=${year}`;
      }
      
      console.log(`Searching TMDb for: "${title}"${year ? ` (${year})` : ''}`);
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Return the first match with additional details
        const movie = data.results[0];
        return {
          tmdbId: movie.id,
          englishTitle: movie.title,
          originalTitle: movie.original_title,
          releaseDate: movie.release_date,
          overview: movie.overview,
          voteAverage: movie.vote_average,
          posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : null,
          genreIds: movie.genre_ids
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error searching TMDb for "${title}":`, error);
      return null;
    }
  }

  async enrichMovieData(movie) {
    // Extract year from title if present (e.g., "Movie Title (2024)")
    const yearMatch = movie.title.match(/\((\d{4})\)/);
    const year = yearMatch ? yearMatch[1] : null;
    const cleanTitle = movie.title.replace(/\s*\(\d{4}\)\s*/, '').trim();
    
    // Try to find TMDb match
    const tmdbData = await this.searchMovie(cleanTitle, year);
    
    if (tmdbData) {
      return {
        ...movie,
        tmdbId: tmdbData.tmdbId,
        englishTitle: tmdbData.englishTitle,
        overview: tmdbData.overview,
        voteAverage: tmdbData.voteAverage,
        poster: tmdbData.posterPath || movie.poster, // Use TMDb poster if available
        backdrop: tmdbData.backdropPath,
        releaseDate: tmdbData.releaseDate,
        // Keep original Romanian title
        romanianTitle: movie.title
      };
    }
    
    return movie;
  }

  async enrichMovies(movies) {
    console.log(`Enriching ${movies.length} movies with TMDb data...`);
    
    const enrichedMovies = await Promise.all(
      movies.map(movie => this.enrichMovieData(movie))
    );
    
    const successCount = enrichedMovies.filter(m => m.tmdbId).length;
    console.log(`TMDb matching complete: ${successCount}/${movies.length} movies matched`);
    
    return enrichedMovies;
  }
}

module.exports = new TMDbService();