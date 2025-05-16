import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import AuthButton from './auth/AuthButton';
import { useContext } from 'react';
import { AppContext } from '../App';
import '../styles/panels/DetailPanel.css';

function DetailPanel({ item, isOpen, closePanel, mediaType }) {
  const { isMobile } = useContext(AppContext);
  
  if (!item) return null;

  // Format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Get episode runtime for TV shows
  const getEpisodeRuntime = () => {
    if (item.episode_run_time && item.episode_run_time.length > 0) {
      const runtime = Math.max(...item.episode_run_time);
      return `${formatRuntime(runtime)} / episode`;
    }
    return 'N/A';
  };

  // Get release year
  const getYear = () => {
    const date = mediaType === 'movie' ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  // Get title
  const getTitle = () => {
    return mediaType === 'movie' ? item.title : item.name;
  };

  // Get genres
  const getGenres = () => {
    if (!item.genres || item.genres.length === 0) return 'N/A';
    return item.genres.map(genre => genre.name).join(', ');
  };

  // Get directors/creators
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
        
        <Link to="/" className="logo-link">
          <h2>Cinema Cloud</h2>
        </Link>
        
        <div className="panel-header-right">
          <AuthButton isMobile={isMobile} />
        </div>
      </div>
      
      <div className="detail-panel-content">
        {/* Poster */}
        <div className="detail-poster">
          {item.poster_path ? (
            <img src={getImageUrl(item.poster_path)} alt={getTitle()} />
          ) : (
            <div className="no-poster">No Poster</div>
          )}
        </div>

        {/* Movie/TV Show Info - Without title */}
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