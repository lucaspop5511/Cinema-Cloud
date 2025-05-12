import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { fetchFromApi, getImageUrl } from '../services/api';
import '../styles/Detail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { closePanel, isMobile } = useContext(AppContext);
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
        
        // Close mobile panel when navigating to detail
        if (isMobile) {
          closePanel();
        }

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
  }, [id, isMobile, closePanel]);

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

  console.log('MovieDetail render - loading:', loading, 'error:', error, 'movie:', movie);

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
          {/* Title and rating */}
          <div className="detail-header">
            <h1 className="detail-title">{movie.title}</h1>
            <div className="detail-rating">
              <span className="rating-value">
                {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10 ★` : 'No rating'}
              </span>
            </div>
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
                {images.slice(0, 4).map((image, index) => (
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