'use client'

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../components/AppWrapper';
import { fetchFromApi, getImageUrl } from '../services/api';
import NowPlayingButton from './NowPlayingButton';
import WatchlistButton from './WatchlistButton';
import '../styles/Detail.css';
import '../styles/NowPlayingButton.css';
import '../styles/StreamingProviders.css';

export default function TvDetail({ params }) {
  const router = useRouter();
  const { closePanel, isMobile, openPanel, isPanelOpen } = useContext(AppContext);
  const [show, setShow] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('TvDetail component mounted, ID:', params?.id);
    
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching TV show details for ID:', params?.id);

        const [showData, creditsData, videosData, imagesData, providersData] = await Promise.all([
          fetchFromApi(`/tv/${params?.id}?language=en-US`),
          fetchFromApi(`/tv/${params?.id}/credits?language=en-US`),
          fetchFromApi(`/tv/${params?.id}/videos?language=en-US`),
          fetchFromApi(`/tv/${params?.id}/images`),
          fetchFromApi(`/tv/${params?.id}/watch/providers`)
        ]);

        console.log('TV show data:', showData);
        setShow({
          ...showData,
          watch_providers: providersData.results?.RO || providersData.results?.US || {}
        });
        setCredits(creditsData);
        setVideos(videosData.results || []);
        setImages(imagesData.backdrops || []);
      } catch (err) {
        console.error('Error fetching TV show details:', err);
        setError('Failed to load TV show details');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchShowDetails();
    }
  }, [params?.id]);

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getEpisodeRuntime = () => {
    if (show?.episode_run_time && show.episode_run_time.length > 0) {
      const runtime = Math.max(...show.episode_run_time);
      return `${formatRuntime(runtime)} / episode`;
    }
    return 'N/A';
  };

  const getTrailer = () => {
    return videos.find(video => video.type === 'Trailer' && video.site === 'YouTube') ||
           videos.find(video => video.site === 'YouTube');
  };

  const getBackdropImage = () => {
    if (images && images.length > 0) {
      return getImageUrl(images[0].file_path);
    }
    if (show?.backdrop_path) {
      return getImageUrl(show.backdrop_path);
    }
    return null;
  };

  const formatVoteCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k votes`;
    }
    return `${count} votes`;
  };

  const getSeasonsText = () => {
    if (!show?.number_of_seasons) return 'N/A';
    return show.number_of_seasons === 1 ? '1 season' : `${show.number_of_seasons} seasons`;
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <p>Loading TV show details...</p>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="detail-error">
        <h2>Error</h2>
        <p>{error || 'TV show not found'}</p>
        <button onClick={() => router.push('/')}>Return to Home</button>
      </div>
    );
  }

  const trailer = getTrailer();
  const backdropImage = getBackdropImage();

  return (
    <div className="detail-container">
      <div className="detail-content">
        <div className="detail-main">
          {/* Hero Section */}
          <div className="detail-hero">
            {/* Background Image */}
            {backdropImage && (
              <div className="detail-hero-background">
                <img src={backdropImage} alt={show.name} />
              </div>
            )}
            
            {/* Overlay */}
            <div className="detail-hero-overlay"></div>
            
            {/* Content */}
            <div className="detail-hero-content">
              {/* Poster */}
              <div className="detail-hero-poster">
                {show.poster_path ? (
                  <img src={getImageUrl(show.poster_path)} alt={show.name} />
                ) : (
                  <div className="no-poster">No Poster</div>
                )}
              </div>
              
              {/* Show Info */}
              <div className="detail-hero-info">
                <h1 className="detail-hero-title">{show.name}</h1>
                
                <div className="detail-hero-meta">
                  <span className="detail-hero-year">
                    {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                  </span>
                  <span className="detail-meta-separator">•</span>
                  <span className="detail-hero-runtime">
                    {getEpisodeRuntime()}
                  </span>
                  {show.number_of_seasons && (
                    <>
                      <span className="detail-meta-separator">•</span>
                      <span className="detail-hero-seasons">
                        {getSeasonsText()}
                      </span>
                    </>
                  )}
                </div>
                
                <p className="detail-hero-overview">
                  {show.overview || 'No overview available.'}
                </p>
                
                <div className="detail-hero-actions">
                  {show.vote_average && (
                    <div className="detail-hero-rating">
                      <span className="star-icon">★</span>
                      <span className="rating-value">
                        {show.vote_average.toFixed(1)}
                      </span>
                      {show.vote_count && (
                        <span className="vote-count">
                          ({formatVoteCount(show.vote_count)})
                        </span>
                      )}
                    </div>
                  )}
                  
                  <WatchlistButton 
                    item={show} 
                    mediaType="tv" 
                    className="hero-watchlist-button" 
                  />
                </div>
                
                {show.genres && show.genres.length > 0 && (
                  <div className="detail-hero-genres">
                    <div className="detail-genres-label">Genres:</div>
                    <div className="detail-genres-list">
                      {show.genres.map(genre => (
                        <span key={genre.id} className="detail-genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="detail-sections">
            {/* Where to Watch */}
            {show.watch_providers && (
              <div className="detail-section streaming-services-section">
                <h3 className="where-to-watch">Where to Watch</h3>
                <div className="streaming-providers detail-providers">
                  {show.watch_providers?.flatrate && show.watch_providers.flatrate.length > 0 ? (
                    <div className="provider-logos">
                      {show.watch_providers.flatrate.map(provider => (
                        <div key={provider.provider_id} className="provider-logo" title={provider.provider_name}>
                          <img 
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                            alt={provider.provider_name} 
                          />
                          <span className="provider-name">{provider.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-providers">No streaming information available</p>
                  )}
                </div>
              </div>
            )}

            {/* Images */}
            {images.length > 1 && (
              <div className="detail-section">
                <h3>Images</h3>
                <div className="detail-images-container">
                  <div 
                    className="detail-images"
                    ref={(el) => {
                      if (el) {
                        const handleScroll = () => {
                          const prevBtn = el.parentElement.querySelector('.prev');
                          const nextBtn = el.parentElement.querySelector('.next');
                          if (prevBtn) prevBtn.disabled = el.scrollLeft <= 0;
                          if (nextBtn) nextBtn.disabled = el.scrollLeft >= el.scrollWidth - el.clientWidth;
                        };
                        el.addEventListener('scroll', handleScroll);
                        handleScroll();
                      }
                    }}
                  >
                    {images.slice(1, 11).map((image, index) => (
                      <div key={index} className="detail-image">
                        <img 
                          src={getImageUrl(image.file_path)} 
                          alt={`TV show still ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button 
                    className="images-nav-arrow prev"
                    onClick={(e) => {
                      const container = e.target.parentElement.querySelector('.detail-images');
                      container.scrollBy({ left: -840, behavior: 'smooth' });
                    }}
                  >
                    ←
                  </button>
                  <button 
                    className="images-nav-arrow next"
                    onClick={(e) => {
                      const container = e.target.parentElement.querySelector('.detail-images');
                      container.scrollBy({ left: 840, behavior: 'smooth' });
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            )}

            {/* Trailer */}
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

            {/* Cast */}
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
    </div>
  );
}