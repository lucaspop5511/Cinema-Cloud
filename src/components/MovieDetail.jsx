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
  const { 
    closePanel, 
    isMobile, 
    selectedDetailItem, 
    closeDetailPanel 
  } = useContext(AppContext);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On very large screens (1800px+), use selectedDetailItem from context
    if (window.innerWidth >= 1800 && selectedDetailItem) {
      console.log('Using selectedDetailItem from context:', selectedDetailItem);
      setMovie(selectedDetailItem);
      setLoading(false);
      return;
    }

    // On smaller screens (under 1800px), use URL params
    if (id) {
      fetchMovieDetails();
    }
  }, [id, selectedDetailItem]);

  const handleClose = () => {
    if (window.innerWidth >= 1800) {
      closeDetailPanel();
    } else {
      navigate(-1);
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
    <>
      <div className="inline-detail-header">
        <h2>Movie Details</h2>
        <button className="inline-detail-close" onClick={handleClose}>
          ✕
        </button>
      </div>
      <div className="inline-detail-content">
        <p>Movie detail content for: {movie.title}</p>
      </div>
    </>
  );
}