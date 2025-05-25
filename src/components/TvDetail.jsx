import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { fetchFromApi, getImageUrl } from '../services/api';
import '../styles/Detail.css';

export default function TvDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    closePanel, 
    isMobile, 
    selectedDetailItem, 
    closeDetailPanel 
  } = useContext(AppContext);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On very large screens (1800px+), use selectedDetailItem from context
    if (window.innerWidth >= 1800 && selectedDetailItem) {
      console.log('Using selectedDetailItem from context:', selectedDetailItem);
      setShow(selectedDetailItem);
      setLoading(false);
      return;
    }

    // On smaller screens (under 1800px), use URL params
    if (id) {
      console.log('TvDetail component mounted, ID:', id);
      
      const fetchShowDetails = async () => {
        try {
          setLoading(true);
          setError(null);

          console.log('Fetching TV show details for ID:', id);

          const showData = await fetchFromApi(`/tv/${id}?language=en-US`);

          console.log('TV show data:', showData);
          setShow(showData);
        } catch (err) {
          console.error('Error fetching TV show details:', err);
          setError('Failed to load TV show details');
        } finally {
          setLoading(false);
        }
      };

      fetchShowDetails();
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
      <div className="inline-detail-panel">
        <div className="inline-detail-loading">
          <p>Loading TV show details...</p>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="inline-detail-panel">
        <div className="inline-detail-error">
          <h2>Error</h2>
          <p>{error || 'TV show not found'}</p>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="inline-detail-header">
        <h2>TV Show Details</h2>
        <button className="inline-detail-close" onClick={handleClose}>
          ✕
        </button>
      </div>
      <div className="inline-detail-content">
        <p>TV show detail content for: {show.name}</p>
      </div>
    </>
  );
}