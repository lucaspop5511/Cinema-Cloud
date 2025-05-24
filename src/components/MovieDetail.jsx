import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { fetchFromApi, getImageUrl } from '../services/api';
import '../styles/Detail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    closePanel, 
    isMobile, 
    openPanel, 
    isPanelOpen, 
    selectedDetailItem, 
    closeDetailPanel 
  } = useContext(AppContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On desktop, use selectedDetailItem from context
    if (!isMobile && selectedDetailItem) {
      console.log('Using selectedDetailItem from context:', selectedDetailItem);
      setMovie(selectedDetailItem);
      setLoading(false);
      return;
    }

    // On mobile, use URL params
    if (id) {
      console.log('MovieDetail component mounted, ID:', id);
      
      const fetchMovieDetails = async () => {
        try {
          setLoading(true);
          setError(null);

          console.log('Fetching movie details for ID:', id);

          const movieData = await fetchFromApi(`/movie/${id}?language=en-US`);

          console.log('Movie data:', movieData);
          setMovie(movieData);
        } catch (err) {
          console.error('Error fetching movie details:', err);
          setError('Failed to load movie details');
        } finally {
          setLoading(false);
        }
      };

      fetchMovieDetails();
    }
  }, [id, selectedDetailItem, isMobile]);

  const handleClose = () => {
    if (isMobile) {
      navigate(-1);
    } else {
      closeDetailPanel();
    }
  };

  if (loading) {
    return (
      <div className="inline-detail-panel">
        <div className="inline-detail-loading">
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="inline-detail-panel">
        <div className="inline-detail-error">
          <h2>Error</h2>
          <p>{error || 'Movie not found'}</p>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-detail-panel">
      <div className="inline-detail-header">
        <h2>Movie Details</h2>
        <button className="inline-detail-close" onClick={handleClose}>
          ✕
        </button>
      </div>
      <div className="inline-detail-content">
        {/* Content will be added in next steps */}
        <p>Movie detail content for: {movie.title}</p>
      </div>
    </div>
  );
}