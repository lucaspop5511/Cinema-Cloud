import { getImageUrl } from '../services/tmdbApi'

function SearchResults({ results, searchType, searchQuery, totalResults = 0 }) {
  const MINIMUM_VOTE_COUNT = 10; // Lower threshold to show more results
  
  // Get release year from date string
  const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  // Get title based on media type
  const getTitle = (item) => {
    return searchType === 'movie' ? item.title : item.name;
  };

  // Get release date based on media type
  const getReleaseDate = (item) => {
    return searchType === 'movie' ? item.release_date : item.first_air_date;
  };

  // Handle case where there are no results
  if (results.length === 0) {
    return (
      <div className="results-container">
        <h2 className="results-title">Results for: {searchQuery}</h2>
        <div className="no-results">
          <p>No {searchType === 'movie' ? 'movies' : 'TV shows'} found matching "{searchQuery}"</p>
        </div>
      </div>
    );
  }

  const filteredResults = results.filter(item => item.vote_count >= MINIMUM_VOTE_COUNT)

  return (
    <div className="results-container">
      <h2 className="results-title">
        {searchQuery} ({filteredResults.length} {searchType === 'movie' ? 'movies' : 'TV shows'} found
        {totalResults > filteredResults.length ? ` of ${totalResults} total` : ''})
      </h2>
      
      <div className="results-grid">
        {filteredResults.map(item => (
          <div key={item.id} className="result-card">
            <div className="result-poster">
              {item.poster_path ? (
                <img src={getImageUrl(item.poster_path)} alt={getTitle(item)} />
              ) : (
                <div className="no-poster">No Poster</div>
              )}
            </div>
            <div className="result-info">
              <h3 className="result-title">{getTitle(item)}</h3>
              <p className="result-year">{getYear(getReleaseDate(item))}</p>
              <div className="result-rating">
                <span className="rating-value">
                  {item.vote_average ? (item.vote_average.toFixed(1) + '/10') : 'No rating'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;