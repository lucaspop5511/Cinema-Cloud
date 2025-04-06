import { useEffect, useRef, useContext, useState } from 'react'
import { AppContext } from '../App'
import '../styles/panels/GenrePanel.css'

function GenrePanel({ isOpen, closePanel }) {
  const { 
    selectedGenres, 
    toggleGenre, 
    setSelectedGenres,
    minYear, 
    setMinYear, 
    maxYear, 
    setMaxYear,
    minRuntime, 
    maxRuntime, 
    setMinRuntime, 
    setMaxRuntime,
    contentRatings, 
    setContentRatings,
    applyFilters,
    searchType,
    isFilterActive,
    filterCounter
  } = useContext(AppContext)
  
  const panelRef = useRef(null)
  const currentYear = new Date().getFullYear()
  
  const [sliderRangeStyle, setSliderRangeStyle] = useState({
    left: '0%',
    width: '0%'
  })
  
  // Track if filters have been modified since last search
  const [filtersModified, setFiltersModified] = useState(false)
  
  // Store initial filter states to detect changes
  const [initialFilters, setInitialFilters] = useState({
    genres: [],
    minYear: 1990,
    maxYear: currentYear,
    minRuntime: 0,
    maxRuntime: 240,
    contentRatings: [],
    searchType: 'movie'
  })
  
  // Update initial filters when search is performed
  useEffect(() => {
    if (isFilterActive) {
      setInitialFilters({
        genres: [...selectedGenres],
        minYear,
        maxYear,
        minRuntime,
        maxRuntime,
        contentRatings: [...contentRatings],
        searchType
      })
      setFiltersModified(false)
    }
  }, [filterCounter])
  
  // Detect changes to any filter
  useEffect(() => {
    // Function to check if any filter has changed
    const checkForChanges = () => {
      // Check if genres changed
      if (selectedGenres.length !== initialFilters.genres.length) {
        return true
      }
      
      for (const genre of selectedGenres) {
        if (!initialFilters.genres.includes(genre)) {
          return true
        }
      }
      
      // Check other filters
      if (minYear !== initialFilters.minYear ||
          maxYear !== initialFilters.maxYear ||
          minRuntime !== initialFilters.minRuntime ||
          maxRuntime !== initialFilters.maxRuntime ||
          searchType !== initialFilters.searchType ||
          contentRatings.length !== initialFilters.contentRatings.length) {
        return true
      }
      
      // Check content ratings
      for (const rating of contentRatings) {
        if (!initialFilters.contentRatings.includes(rating)) {
          return true
        }
      }
      
      return false
    }
    
    setFiltersModified(checkForChanges())
  }, [
    selectedGenres, 
    minYear, 
    maxYear, 
    minRuntime, 
    maxRuntime, 
    contentRatings,
    searchType
  ])
  
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

  // Handle year input validation and step adjustment
  const handleMinYearChange = (e) => {
    setMinYear(e.target.value)
  }
  
  const handleMaxYearChange = (e) => {
    setMaxYear(e.target.value)
  }
  
  const validateMinYear = () => {
    let validatedValue = parseInt(minYear)
    if (isNaN(validatedValue) || validatedValue < 1900) {
      validatedValue = 1990 // Default to 1990 instead of 1900
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
  
  // Year increment/decrement with 5-year steps
  const incrementYear = (setter, currentValue) => {
    // Round up to nearest multiple of 5
    const nextValue = Math.ceil((parseInt(currentValue) + 1) / 5) * 5;
    setter(nextValue > currentYear ? currentYear : nextValue);
  }
  
  const decrementYear = (setter, currentValue) => {
    // Round down to nearest multiple of 5
    const nextValue = Math.floor((parseInt(currentValue) - 1) / 5) * 5;
    setter(nextValue < 1900 ? 1900 : nextValue);
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
  
  // Simplified search button class - just active or not
  const getSearchButtonClass = () => {
    return isFilterActive && !filtersModified ? "search-button active" : "search-button";
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
              <div className="year-input-container">
                <input 
                  id="min-year"
                  type="number" 
                  min="1900" 
                  max={currentYear}
                  value={minYear}
                  onChange={handleMinYearChange}
                  onBlur={validateMinYear}
                />
                <div className="year-controls">
                  <button 
                    type="button" 
                    className="year-control-btn up"
                    onClick={() => incrementYear(setMinYear, minYear)}
                    aria-label="Increase minimum year"
                  >
                    <span className="arrow-up">&#9650;</span>
                  </button>
                  <button 
                    type="button" 
                    className="year-control-btn down"
                    onClick={() => decrementYear(setMinYear, minYear)}
                    aria-label="Decrease minimum year"
                  >
                    <span className="arrow-down">&#9660;</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="year-separator">-</div>
            <div className="input-group">
              <label htmlFor="max-year">To</label>
              <div className="year-input-container">
                <input 
                  id="max-year"
                  type="number" 
                  min="1900" 
                  max={currentYear} 
                  value={maxYear}
                  onChange={handleMaxYearChange}
                  onBlur={validateMaxYear}
                />
                <div className="year-controls">
                  <button 
                    type="button" 
                    className="year-control-btn up"
                    onClick={() => incrementYear(setMaxYear, maxYear)}
                    aria-label="Increase maximum year"
                  >
                    <span className="arrow-up">&#9650;</span>
                  </button>
                  <button 
                    type="button" 
                    className="year-control-btn down"
                    onClick={() => decrementYear(setMaxYear, maxYear)}
                    aria-label="Decrease maximum year"
                  >
                    <span className="arrow-down">&#9660;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="filter-section">
          <h3 className="filter-section-title">
            {searchType === 'tv' ? 'Episode Runtime' : 'Runtime'}
          </h3>
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
          className={getSearchButtonClass()}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default GenrePanel