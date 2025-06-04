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

  return (
    <div className="detail-container">
      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-header">
            <h1 className="detail-title">{show.name}</h1>
            <div className="detail-actions">
              <WatchlistButton item={show} mediaType="tv" className="header-watchlist-button" />
              <div className="detail-rating">
                <span className="rating-value">
                  {show.vote_average ? `${show.vote_average.toFixed(1)}/10 ★` : 'No rating'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-overview">
            <p>{show.overview || 'No overview available.'}</p>
          </div>
          
          {show.watch_providers && (
            <div className="detail-section streaming-services-section">
              <h3>Where to Watch</h3>
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

          {images.length > 0 && (
            <div className="detail-section">
              <h3>Images</h3>
              <div className="detail-images">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="detail-image">
                    <img 
                      src={getImageUrl(image.file_path)} 
                      alt={`TV show still ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

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