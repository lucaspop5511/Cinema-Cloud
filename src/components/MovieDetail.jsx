// Updated MovieDetail.jsx to fix mobile menu duplication and watchlist button placement

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { fetchFromApi, getImageUrl } from '../services/api';
import NowPlayingButton from './NowPlayingButton';
import WatchlistButton from './WatchlistButton';
import '../styles/Detail.css';
import '../styles/NowPlayingButton.css';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { closePanel, isMobile, openPanel, isPanelOpen } = useContext(AppContext);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('MovieDetail component mounted, ID:', id);
    
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching movie details for ID:', id);

        // Fetch multiple endpoints
        const [movieData, creditsData, videosData, imagesData] = await Promise.all([
          fetchFromApi(`/movie/${id}?language=en-US`),
          fetchFromApi(`/movie/${id}/credits?language=en-US`),
          fetchFromApi(`/movie/${id}/videos?language=en-US`),
          fetchFromApi(`/movie/${id}/images`)
        ]);

        console.log('Movie data:', movieData);
        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData.results || []);
        setImages(imagesData.backdrops || []);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // Format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Get primary trailer
  const getTrailer = () => {
    return videos.find(video => video.type === 'Trailer' && video.site === 'YouTube') ||
           videos.find(video => video.site === 'YouTube');
  };

  // Handle mobile menu toggle - don't need this as we'll use Header component's toggle
  const handleMenuToggle = () => {
    if (isMobile) {
      if (isPanelOpen) {
        closePanel();
      } else {
        openPanel();
      }
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="detail-error">
        <h2>Error</h2>
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  const trailer = getTrailer();

  return (
    <div className="detail-container">
      <div className="detail-content">
        {/* Main content area */}
        <div className="detail-main">
          {/* Title row with watchlist button */}
          <div className="detail-header">
            <h1 className="detail-title">{movie.title}</h1>
            <div className="detail-actions">
              {/* Add watchlist button next to rating */}
              <WatchlistButton item={movie} mediaType="movie" className="header-watchlist-button" />
              <div className="detail-rating">
                <span className="rating-value">
                  {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10 ★` : 'No rating'}
                </span>
              </div>
            </div>
          </div>

          {/* Now Playing Button for movies in cinema */}
          <div className="detail-now-playing">
            <NowPlayingButton mediaType="movie" itemId={id} />
          </div>

          {/* Overview */}
          <div className="detail-overview">
            <p>{movie.overview || 'No overview available.'}</p>
          </div>

          {/* Images section */}
          {images.length > 0 && (
            <div className="detail-section">
              <h3>Images</h3>
              <div className="detail-images">
                {images.slice(2, 6).map((image, index) => (
                  <div key={index} className="detail-image">
                    <img 
                      src={getImageUrl(image.file_path)}
                      alt={`Movie still ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trailer section */}
          {trailer && (
            <div className="detail-section">
              <h3>Trailer</h3>
              <div className="detail-trailer">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Cast section */}
          {credits && credits.cast && (
            <div className="detail-section">
              <h3>Cast</h3>
              <div className="detail-cast">
                {credits.cast.slice(0, 10).map((person) => (
                  <div key={person.id} className="cast-member">
                    <div className="cast-photo">
                      {person.profile_path ? (
                        <img 
                          src={getImageUrl(person.profile_path)} 
                          alt={person.name}
                        />
                      ) : (
                        <div className="no-photo">No Photo</div>
                      )}
                    </div>
                    <div className="cast-info">
                      <p className="cast-name">{person.name}</p>
                      <p className="cast-character">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}