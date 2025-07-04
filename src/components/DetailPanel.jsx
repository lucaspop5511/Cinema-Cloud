import Link from 'next/link'; 
import { getImageUrl } from '../services/api';
import AuthButton from './auth/AuthButton';
import { useContext } from 'react';
import { AppContext } from './AppWrapper';
import WatchlistButton from './WatchlistButton'; 
import '../styles/panels/DetailPanel.css';

function DetailPanel({ item, isOpen, closePanel, mediaType }) {
  const { isMobile } = useContext(AppContext);
  
  if (!item) return null;

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getEpisodeRuntime = () => {
    if (item.episode_run_time && item.episode_run_time.length > 0) {
      const runtime = Math.max(...item.episode_run_time);
      return `${formatRuntime(runtime)} / episode`;
    }
    return 'N/A';
  };

  const getYear = () => {
    const date = mediaType === 'movie' ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const getTitle = () => {
    return mediaType === 'movie' ? item.title : item.name;
  };

  const getGenres = () => {
    if (!item.genres || item.genres.length === 0) return 'N/A';
    return item.genres.map(genre => genre.name).join(', ');
  };

  const getDirectorOrCreator = () => {
    if (mediaType === 'movie' && item.director) {
      return `Director: ${item.director}`;
    }
    if (mediaType === 'tv' && item.created_by && item.created_by.length > 0) {
      return `Created by: ${item.created_by.map(creator => creator.name).join(', ')}`;
    }
    return null;
  };

  return (
    <div className={`detail-panel ${isOpen ? 'open' : ''}`}>
      <div className="detail-panel-header">
        <div className="panel-header-left">
          {isMobile && isOpen && ( 
            <button 
              type="button"
              className="close-panel-btn"
              onClick={closePanel}
              aria-label="Close panel"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="panel-header-right">
          <AuthButton isMobile={isMobile} />
        </div>
      </div>
      
      <div className="detail-panel-content">
        <div className="detail-poster">
          {item.poster_path ? (
            <div className="detail-poster-container">
              <img src={getImageUrl(item.poster_path)} alt={getTitle()} />
              <WatchlistButton item={item} mediaType={mediaType} />
            </div>
          ) : (
            <div className="no-poster">No Poster</div>
          )}
        </div>

        <div className="detail-info">
          <div className="detail-info-item">
            <span className="info-label">Release Year:</span>
            <span className="info-value">{getYear()}</span>
          </div>

          <div className="detail-info-item">
            <span className="info-label">Runtime:</span>
            <span className="info-value">
              {mediaType === 'movie' ? formatRuntime(item.runtime) : getEpisodeRuntime()}
            </span>
          </div>

          {mediaType === 'tv' && item.number_of_seasons && (
            <div className="detail-info-item">
              <span className="info-label">Seasons:</span>
              <span className="info-value">{item.number_of_seasons}</span>
            </div>
          )}

          <div className="detail-info-item">
            <span className="info-label">Genres:</span>
            <span className="info-value">{getGenres()}</span>
          </div>

          <div className="detail-info-item">
            <span className="info-label">IMDb Score:</span>
            <span className="info-value">
              {item.vote_average ? `${item.vote_average.toFixed(1)}/10` : 'N/A'}
            </span>
          </div>

          {getDirectorOrCreator() && (
            <div className="detail-info-item">
              <span className="info-value director-creator">
                {getDirectorOrCreator()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPanel;