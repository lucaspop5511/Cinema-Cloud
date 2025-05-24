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
    openPanel, 
    isPanelOpen, 
    selectedDetailItem, 
    closeDetailPanel 
  } = useContext(AppContext);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On desktop, use selectedDetailItem from context
    if (!isMobile && selectedDetailItem) {
      console.log('Using selectedDetailItem from context:', selectedDetailItem);
      setShow(selectedDetailItem);
      setLoading(false);
      return;
    }

    // On mobile, use URL params
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
    <div className="inline-detail-panel">
      <div className="inline-detail-header">
        <h2>TV Show Details</h2>
        <button className="inline-detail-close" onClick={handleClose}>
          ✕
        </button>
      </div>
      <div className="inline-detail-content">
        {/* Content will be added in next steps */}
        <p>TV show detail content for: {show.name}</p>
      </div>
    </div>
  );
}