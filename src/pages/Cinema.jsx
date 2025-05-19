import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterHeader from '../components/FilterHeader';
import { AppContext } from '../App';
import { fetchFromApi, getImageUrl, getFilteredContent } from '../services/api';
import WatchlistButton from '../components/WatchlistButton';
import '../styles/Cinema.css';
import '../styles/StreamingProviders.css';

// Romanian cities with their Cinemagia URLs (in alphabetical order)
const CINEMA_CITIES = [
  { value: 'bacau', label: 'Bacău', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/bacau/' },
  { value: 'brasov', label: 'Brașov', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/brasov/' },
  { value: 'bucharest', label: 'București', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/bucuresti/' },
  { value: 'cluj', label: 'Cluj-Napoca', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/cluj/' },
  { value: 'constanta', label: 'Constanța', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/constanta/' },
  { value: 'craiova', label: 'Craiova', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/craiova/' },
  { value: 'galati', label: 'Galați', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/galati/' },
  { value: 'iasi', label: 'Iași', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/iasi/' },
  { value: 'ploiesti', label: 'Ploiești', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/ploiesti/' },
  { value: 'sibiu', label: 'Sibiu', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/sibiu/' },
  { value: 'timisoara', label: 'Timișoara', cinemaUrl: 'https://www.cinemagia.ro/program-cinema/timisoara/' }
];

// Streaming services for TV shows
const STREAMING_SERVICES = [
  { value: 'none', label: 'All Platforms' },
  { value: '8', label: 'Netflix' },
  { value: '337', label: 'Disney+' },
  { value: '384', label: 'HBO Max' },
  { value: '15', label: 'Hulu' },
  { value: '350', label: 'Apple TV+' },
  { value: '531', label: 'Paramount+' },
  { value: '1899', label: 'Max' },
  { value: '283', label: 'Crunchyroll' }
];

function Cinema() {
  const navigate = useNavigate();
  const {
    selectedGenres,
    minYear,
    maxYear,
    minRuntime,
    maxRuntime,
    imdbRating,
    genreIdMapping,
    filterCounter,
    clearFiltersCounter,
    isFilterActive,
    setSearchType,
    searchType
  } = useContext(AppContext);

  const [mediaType, setMediaType] = useState('movie');
  const [selectedCity, setSelectedCity] = useState(CINEMA_CITIES[0]);
  const [selectedStreaming, setSelectedStreaming] = useState(STREAMING_SERVICES[0]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert IMDB rating to min/max values
  const getImdbRatingRange = () => {
    switch (imdbRating) {
      case '<6':
        return { min: 0, max: 6 };
      case '6-7':
        return { min: 6, max: 7 };
      case '7-8':
        return { min: 7, max: 8 };
      case '8+':
        return { min: 8, max: 10 };
      default:
        return null;
    }
  };

  // Check if filters should be applied (only for TV shows)
  const hasActiveFilters = () => {
    return selectedGenres.length > 0 || 
           minYear !== 1990 || 
           maxYear !== new Date().getFullYear() ||
           minRuntime !== 0 ||
           maxRuntime !== 240 ||
           imdbRating !== 'none';
  };

  // Fetch content based on media type and selected options
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching content for:', mediaType, 'with filters active:', isFilterActive, 'streaming service:', selectedStreaming.value);
        
        if (mediaType === 'movie') {
          // For movies, just fetch now playing - no filters
          const endpoint = '/movie/now_playing?language=en-US&region=RO&page=1';
          const response = await fetchFromApi(endpoint);
          let results = response.results || [];
          
          // Fetch additional details for movies (runtime)
          if (results.length > 0) {
            const detailedContent = await Promise.all(
              results.map(async (item) => {
                try {
                  const details = await fetchFromApi(`/movie/${item.id}?language=en-US`);
                  return { ...item, runtime: details.runtime };
                } catch (error) {
                  console.error(`Error fetching details for movie ${item.id}:`, error);
                  return item;
                }
              })
            );
            setContent(detailedContent);
          } else {
            setContent(results);
          }
        } else {
          // For TV shows, only apply filters when explicitly requested via filterCounter
          if (mediaType === 'tv' && isFilterActive) {
            console.log('Applying filters to TV shows in Cinema');
            
            // Convert selected genre names to IDs
            const genreIds = selectedGenres.map(genre => genreIdMapping[genre]).filter(id => id);
            const ratingRange = getImdbRatingRange();
            
            // Use filtered content system for TV shows, including streaming service
            const filterParams = {
              mediaType: 'tv',
              genres: genreIds,
              minYear,
              maxYear,
              minRuntime,
              maxRuntime,
              imdbRating: ratingRange,
              streamingService: selectedStreaming.value !== 'none' ? selectedStreaming.value : null
            };
            
            console.log('Filter params with streaming service:', filterParams);
            
            // Get TV shows with both filters and streaming service
            const data = await getFilteredContent(filterParams, 1);
            console.log('Results:', data);
            setContent(data.results || []);
          } else {
            // Regular TV show fetching without filters, but with streaming service
            console.log('Fetching TV shows without filters, streaming service:', selectedStreaming.value);
            
            let endpoint;
            if (selectedStreaming.value === 'none') {
              // All platforms - use on_the_air endpoint
              endpoint = '/tv/on_the_air?language=en-US&page=1';
            } else {
              // Specific streaming platform using discover API
              endpoint = `/discover/tv?language=en-US&sort_by=popularity.desc&page=1&with_watch_providers=${selectedStreaming.value}&watch_region=US&with_status=0`;
            }
            
            console.log('Using endpoint:', endpoint);
            
            const response = await fetchFromApi(endpoint);
            let results = response.results || [];
            console.log('Raw TV results:', results.length);
            
            // Fetch additional details for TV shows including watch providers
            if (results.length > 0) {
              const detailedContent = await Promise.all(
                results.map(async (item) => {
                  try {
                    const [details, providers] = await Promise.all([
                      fetchFromApi(`/tv/${item.id}?language=en-US`),
                      fetchFromApi(`/tv/${item.id}/watch/providers`)
                    ]);
                    
                    // Get providers for Romania or US as fallback
                    const watchProviders = providers.results?.RO || providers.results?.US || {};
                    
                    return { 
                      ...item, 
                      number_of_seasons: details.number_of_seasons,
                      watch_providers: watchProviders
                    };
                  } catch (error) {
                    console.error(`Error fetching details for TV ${item.id}:`, error);
                    return item;
                  }
                })
              );
              setContent(detailedContent);
            } else {
              setContent(results);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [
    mediaType, 
    selectedCity, 
    selectedStreaming, 
    filterCounter, // Only refresh when filters are explicitly applied
    clearFiltersCounter // Refresh when filters are cleared
  ]);

  // Update search type context when media type changes
  useEffect(() => {
    console.log('Setting search type to:', mediaType);
    setSearchType(mediaType);
  }, [mediaType, setSearchType]);

  const handleMediaTypeChange = (type) => {
    console.log('Media type changing from', mediaType, 'to', type);
    setMediaType(type);
  };

  const handleCityChange = (event) => {
    const cityValue = event.target.value;
    const city = CINEMA_CITIES.find(c => c.value === cityValue);
    setSelectedCity(city);
  };

  const handleStreamingChange = (event) => {
    const streamingValue = event.target.value;
    const streaming = STREAMING_SERVICES.find(s => s.value === streamingValue);
    setSelectedStreaming(streaming);
  };

  const getTitle = (item) => {
    return mediaType === 'movie' ? item.title : item.name;
  };

  const getDate = (item) => {
    return mediaType === 'movie' ? item.release_date : item.first_air_date;
  };

  const getYear = (item) => {
    const date = getDate(item);
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getAdditionalInfo = (item) => {
    if (mediaType === 'movie') {
      return item.runtime ? formatRuntime(item.runtime) : 'N/A';
    } else {
      return item.number_of_seasons ? `${item.number_of_seasons} season${item.number_of_seasons !== 1 ? 's' : ''}` : 'N/A';
    }
  };

  const handleContentClick = (item) => {
    // Navigate to the detail page based on media type
    navigate(`/${mediaType}/${item.id}`);
  };
  
  // Removed isCurrentlyActive function since not needed

  if (loading) {
    return (
      <div className="cinema-container">
        <div className="cinema-loading">
          <p>Loading {mediaType === 'movie' ? 'movies' : 'TV shows'}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cinema-container">
        <div className="cinema-error">
          <h3>Error loading {mediaType === 'movie' ? 'movies' : 'TV shows'}</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cinema-container">
      <div className="cinema-header">
        <h1>Now Playing & Currently Airing</h1>
        
        {/* Media Type Picker */}
        <div className="media-type-picker">
          <button 
            className={`media-type-button ${mediaType === 'movie' ? 'active' : ''}`}
            onClick={() => handleMediaTypeChange('movie')}
          >
            Movies
          </button>
          <button 
            className={`media-type-button ${mediaType === 'tv' ? 'active' : ''}`}
            onClick={() => handleMediaTypeChange('tv')}
          >
            TV Shows
          </button>
        </div>

        {/* Conditional Dropdowns */}
        {mediaType === 'movie' ? (
          <div className="cinema-city-selector">
            <label htmlFor="city-select">Choose your city:</label>
            <select 
              id="city-select"
              value={selectedCity.value} 
              onChange={handleCityChange}
              className="cinema-dropdown"
            >
              {CINEMA_CITIES.map(city => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="streaming-selector">
            <label htmlFor="streaming-select">Choose platform:</label>
            <select 
              id="streaming-select"
              value={selectedStreaming.value} 
              onChange={handleStreamingChange}
              className="cinema-dropdown"
            >
              {STREAMING_SERVICES.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <FilterHeader />

      {/* Content Section */}
      <div className="content-section">
        <h2>
          {mediaType === 'movie' 
            ? 'Now Playing in Romanian Cinemas' 
            : `Currently Airing TV Shows${selectedStreaming.value !== 'none' ? ` on ${selectedStreaming.label}` : ''}`
          }
        </h2>
        
        {content.length > 0 ? (
          <div className="content-list">
            {content.map(item => (
              <div 
                key={item.id} 
                className="content-row clickable"
                onClick={() => handleContentClick(item)}
              >
                <div className="content-poster">
                  {item.poster_path ? (
                    <img 
                      src={getImageUrl(item.poster_path)} 
                      alt={getTitle(item)}
                    />
                  ) : (
                    <div className="no-poster">No Poster</div>
                  )}
                  {/* Watchlist Button */}
                  <WatchlistButton item={item} mediaType={mediaType} />
                  
                  {/* Removed Now Playing/Currently Airing Button from Cinema page */}
                </div>
                
                <div className="content-info">
                  <div className="content-header">
                    <h3 className="content-title">{getTitle(item)}</h3>
                    <div className="content-rating">
                      {item.vote_average ? `★ ${item.vote_average.toFixed(1)}` : 'No rating'}
                    </div>
                  </div>
                  
                  <div className="content-details">
                    <span className="content-year">{getYear(item)}</span>
                    <span className="content-separator">•</span>
                    <span className="content-additional">
                      {getAdditionalInfo(item)}
                    </span>
                  </div>
                  
                  <p className="content-overview">
                    {item.overview || 'No description available.'}
                  </p>
                  
                  {mediaType === 'tv' && item.watch_providers && (
                    <div className="streaming-providers">
                      <span className="streaming-label">Available on: </span>
                      <div className="provider-logos">
                        {item.watch_providers.flatrate?.map(provider => (
                          <div key={provider.provider_id} className="provider-logo" title={provider.provider_name}>
                            <img 
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                              alt={provider.provider_name} 
                            />
                          </div>
                        ))}
                        {item.watch_providers.flatrate?.length === 0 && (
                          <span className="no-providers">No streaming info available</span>
                        )}
                        {!item.watch_providers.flatrate && (
                          <span className="no-providers">No streaming info available</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {mediaType === 'movie' && (
                    <a 
                      href={selectedCity.cinemaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cinema-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Showtimes in {selectedCity.label} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-content">
            <p>No {mediaType === 'movie' ? 'movies' : 'TV shows'} found for your selection.</p>
            {mediaType === 'tv' && isFilterActive && hasActiveFilters() && (
              <p>Try adjusting your filters or clearing them to see more results.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cinema;