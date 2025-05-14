import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MovieCards.css';

function MovieCards({ movies, loading, error }) {
  const navigate = useNavigate();

  const handleMovieClick = (movie) => {
    // Only navigate if the movie has a TMDb ID
    if (movie.tmdbId) {
      console.log(`Navigating to movie: ${movie.englishTitle || movie.title} (TMDb ID: ${movie.tmdbId})`);
      navigate(`/movie/${movie.tmdbId}`);
    } else {
      console.log(`No TMDb ID found for: ${movie.title}`);
    }
  };

  if (loading) {
    return (
      <div className="movies-loading">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-error">
        <h3>Error loading movies</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="no-movies">
        <h3>No movies found</h3>
        <p>No showtimes available for this date and cinema.</p>
      </div>
    );
  }

  return (
    <div className="movies-container">
      <h3>Movies & Showtimes</h3>
      <div className="movies-grid">
        {movies.map((movie, index) => (
          <div 
            key={index} 
            className={`movie-card ${movie.tmdbId ? 'clickable' : ''}`}
            onClick={() => handleMovieClick(movie)}
          >
            <div className="movie-poster">
              {movie.poster ? (
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/150/225';
                  }}
                />
              ) : (
                <div className="no-poster">No Poster</div>
              )}
            </div>
            
            <div className="movie-info">
              <h4 className="movie-title">
                {movie.englishTitle || movie.title}
                {movie.englishTitle && movie.englishTitle !== movie.title && (
                  <span className="romanian-title">({movie.title})</span>
                )}
              </h4>
              
              <div className="movie-details">
                {movie.duration > 0 && (
                  <span className="movie-duration">{movie.duration} min</span>
                )}
                {movie.genre && movie.genre !== 'Unknown' && (
                  <span className="movie-genre">{movie.genre}</span>
                )}
                {movie.voteAverage && (
                  <span className="movie-rating">⭐ {movie.voteAverage.toFixed(1)}</span>
                )}
              </div>

              {movie.overview && (
                <p className="movie-overview">{movie.overview.substring(0, 100)}...</p>
              )}
              
              <div className="movie-showtimes">
                {movie.showtimes && movie.showtimes.length > 0 ? (
                  <>
                    <span className="showtimes-label">Showtimes:</span>
                    <div className="showtimes-list">
                      {movie.showtimes.map((time, timeIndex) => (
                        <span key={timeIndex} className="showtime-chip">
                          {time}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="no-showtimes">No showtimes available</span>
                )}
              </div>

              {movie.tmdbId && (
                <div className="click-hint">
                  Click for details →
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieCards;