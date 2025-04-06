import { useEffect, useRef, useContext, useState } from 'react'
import { AppContext } from '../App'
import '../styles/GenrePanel.css'

function GenrePanel({ isOpen, closePanel }) {
  const { 
    selectedGenres, 
    toggleGenre, 
    setSelectedGenres,
    minYear, 
    maxYear, 
    setMinYear, 
    setMaxYear,
    minRuntime, 
    maxRuntime, 
    setMinRuntime, 
    setMaxRuntime,
    contentRatings, 
    setContentRatings,
    applyFilters
  } = useContext(AppContext)
  
  const panelRef = useRef(null)
  const currentYear = new Date().getFullYear()
  
  const [sliderRangeStyle, setSliderRangeStyle] = useState({
    left: '0%',
    width: '0%'
  })
  
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
    'Thriller', 'War', 'Western'
  ].sort();
  
  const contentRatingOptions = [
    'G', 'PG', 'PG-13', 'R'
  ];
  
  // Handle escape key to close panel on mobile
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen && window.innerWidth < 768) {
        closePanel()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, closePanel])

  // Handle year input validation
  const handleMinYearChange = (e) => {
    setMinYear(e.target.value)
  }
  
  const handleMaxYearChange = (e) => {
    setMaxYear(e.target.value)
  }
  
  const validateMinYear = () => {
    let validatedValue = parseInt(minYear)
    if (isNaN(validatedValue) || validatedValue < 1900) {
      validatedValue = 1900
    } else if (validatedValue > parseInt(maxYear)) {
      validatedValue = parseInt(maxYear)
    }
    setMinYear(validatedValue)
  }
  
  const validateMaxYear = () => {
    let validatedValue = parseInt(maxYear)
    if (isNaN(validatedValue) || validatedValue > currentYear) {
      validatedValue = currentYear
    } else if (validatedValue < parseInt(minYear)) {
      validatedValue = parseInt(minYear)
    }
    setMaxYear(validatedValue)
  }
  
  // Handle runtime changes
  const handleMinRuntimeChange = (e) => {
    let newMinRuntime = parseInt(e.target.value)
    // Ensure minimum 30 minute difference
    if (maxRuntime - newMinRuntime < 30) {
      newMinRuntime = maxRuntime - 30
    }
    setMinRuntime(newMinRuntime)
    updateSliderRangeStyle()
  }
  
  const handleMaxRuntimeChange = (e) => {
    let newMaxRuntime = parseInt(e.target.value)
    // Ensure minimum 30 minute difference
    if (newMaxRuntime - minRuntime < 30) {
      newMaxRuntime = minRuntime + 30
    }
    setMaxRuntime(newMaxRuntime)
    updateSliderRangeStyle()
  }
  
  // Format runtime as hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) {
      return `${mins}m`
    } else if (mins === 0) {
      return `${hours}h`
    } else {
      return `${hours}h${mins}m`
    }
  }

  const updateSliderRangeStyle = () => {
    const min = minRuntime
    const max = maxRuntime
    const rangeMin = 0
    const rangeMax = 240
    
    const leftPosition = ((min - rangeMin) / (rangeMax - rangeMin)) * 100
    const rightPosition = ((max - rangeMin) / (rangeMax - rangeMin)) * 100
    const rangeWidth = rightPosition - leftPosition
    
    setSliderRangeStyle({
      left: `${leftPosition}%`,
      width: `${rangeWidth}%`
    })
  }
  
  useEffect(() => {
    updateSliderRangeStyle()
  }, [minRuntime, maxRuntime])
  
  // Toggle content rating selection
  const toggleRating = (rating) => {
    setContentRatings(prevRatings => 
      prevRatings.includes(rating)
        ? prevRatings.filter(r => r !== rating)
        : [...prevRatings, rating]
    )
  }
  
  // Limit genre selection to 3
  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      // If genre is already selected, remove it
      toggleGenre(genre);
    } else if (selectedGenres.length < 3) {
      // If less than 3 genres are selected, add the genre
      toggleGenre(genre);
    }
    // If 3 genres are already selected and trying to add another, do nothing
  }
  
  // Handle search button click
  const handleSearch = () => {
    applyFilters();
    
    // Close panel on mobile after search
    if (window.innerWidth < 768) {
      closePanel();
    }
  }

  return (
    <div className={`genre-panel ${isOpen ? 'open' : ''}`} ref={panelRef}>
      <div className="genre-panel-header">
        <h2>Filter</h2>
        {window.innerWidth < 768 && isOpen && (
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
      
      <div className="genre-panel-content">
        <section className="filter-section">
          <h3 className="filter-section-title">Categories (max 3)</h3>
          <div className="genre-grid">
            {genres.map((genre) => (
              <button 
                key={genre} 
                type="button"
                className={`genre-item ${selectedGenres.includes(genre) ? 'active' : ''}`}
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
        
        <section className="filter-section">
          <h3 className="filter-section-title">Year Released</h3>
          <div className="year-inputs">
            <div className="input-group">
              <label htmlFor="min-year">From</label>
              <input 
                id="min-year"
                type="number" 
                min="1900" 
                max={currentYear}
                value={minYear}
                onChange={handleMinYearChange}
                onBlur={validateMinYear}
              />
            </div>
            <div className="year-separator">-</div>
            <div className="input-group">
              <label htmlFor="max-year">To</label>
              <input 
                id="max-year"
                type="number" 
                min="1900" 
                max={currentYear} 
                value={maxYear}
                onChange={handleMaxYearChange}
                onBlur={validateMaxYear}
              />
            </div>
          </div>
        </section>
        
        <section className="filter-section">
          <h3 className="filter-section-title">Runtime</h3>
          <div className="runtime-slider-container">
            <div className="runtime-labels">
              <span>{formatRuntime(minRuntime)}</span>
              <span>{formatRuntime(maxRuntime)}</span>
            </div>
            <div className="dual-slider">
              <div className="slider-track"></div>
              <div 
                className="slider-range" 
                style={sliderRangeStyle}
              ></div>
              <input 
                type="range" 
                min="0" 
                max="240" 
                step="10"
                value={minRuntime}
                onChange={handleMinRuntimeChange}
                className="slider min-slider"
              />
              <input 
                type="range" 
                min="0" 
                max="240" 
                step="10"
                value={maxRuntime}
                onChange={handleMaxRuntimeChange}
                className="slider max-slider"
              />
            </div>
          </div>
        </section>
        
        <section className="filter-section">
          <h3 className="filter-section-title">Content Rating</h3>
          <div className="rating-grid">
            {contentRatingOptions.map((rating) => (
              <button 
                key={rating} 
                type="button"
                className={`genre-item ${contentRatings.includes(rating) ? 'active' : ''}`}
                onClick={() => toggleRating(rating)}
              >
                {rating}
              </button>
            ))}
          </div>
        </section>
      </div>
      
      <div className="genre-panel-footer">
        <button 
          type="button"
          className="search-button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default GenrePanel