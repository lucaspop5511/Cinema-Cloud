const tmdbService = require('./services/tmdbService');

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import scrapers
const { scrapeCinemaCity } = require('./scrapers/cinemacity');
const { scrapeMovieplex } = require('./scrapers/movieplex');

// Import configurations
const { CINEMAS } = require('./config/cinemas');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cache to store results for 30 minutes
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Utility functions
function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Clean up old cache entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 60 * 60 * 1000);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cache_size: cache.size
  });
});

// Get all cinemas
app.get('/api/cinemas', (req, res) => {
  try {
    const allCinemas = [];
    
    Object.entries(CINEMAS).forEach(([chainKey, chain]) => {
      chain.locations.forEach(location => {
        allCinemas.push({
          id: `${chainKey}-${location.id}`,
          name: `${chain.name} ${location.name}`,
          city: location.city,
          address: location.address,
          phone: location.phone || 'N/A',
          chain: chain.name,
          chainKey,
          locationSlug: location.slug
        });
      });
    });
    
    res.json(allCinemas);
  } catch (error) {
    console.error('Error getting cinemas:', error);
    res.status(500).json({ error: 'Failed to get cinemas' });
  }
});

// Get movies for a specific cinema and date
app.get('/api/movies/:cinemaId/:date', async (req, res) => {
  try {
    const { cinemaId, date } = req.params;
    
    console.log(`Request for cinemaId: ${cinemaId}, date: ${date}`);
    
    // Parse cinema ID correctly for chains with hyphens
    const lastHyphenIndex = cinemaId.lastIndexOf('-');
    const chainKey = cinemaId.substring(0, lastHyphenIndex);
    const locationId = cinemaId.substring(lastHyphenIndex + 1);
    
    console.log(`Parsed - chainKey: ${chainKey}, locationId: ${locationId}`);
    console.log(`Available chains: ${Object.keys(CINEMAS)}`);
    
    if (!CINEMAS[chainKey]) {
      console.log(`Chain not found: ${chainKey}`);
      console.log(`Available chains: ${Object.keys(CINEMAS)}`);
      return res.status(404).json({ error: 'Cinema chain not found' });
    }
    
    const location = CINEMAS[chainKey].locations.find(
      loc => loc.id.toString() === locationId
    );
    
    console.log(`Looking for location ID: ${locationId}`);
    console.log(`Available locations for ${chainKey}:`, CINEMAS[chainKey].locations.map(l => `${l.id} (${l.name})`));
    
    if (!location) {
      console.log(`Location not found: ${locationId}`);
      return res.status(404).json({ error: 'Cinema location not found' });
    }
    
    console.log(`Found location: ${location.name}`);
    
    // Check cache first
    const cacheKey = `${cinemaId}-${date}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      console.log(`Serving cached data for ${cacheKey}`);
      return res.json(cached);
    }
    
    // Scrape based on chain
    let movies = [];
    
    try {
      switch (chainKey) {
        case 'cinema-city':
          console.log(`Scraping Cinema City for location: ${location.name}`);
          movies = await scrapeCinemaCity(location, date);
          break;
        case 'movieplex':
          console.log(`Scraping Movieplex for location: ${location.name}`);
          movies = await scrapeMovieplex(location, date);
          break;
        default:
          return res.status(400).json({ error: 'Unsupported cinema chain' });
      }
      
      console.log(`Scraping completed. Found ${movies.length} movies`);
      
      // Enrich movies with TMDb data
      if (movies.length > 0) {
        console.log('Enriching movies with TMDb data...');
        movies = await tmdbService.enrichMovies(movies);
      }
      
      // Cache the enriched results
      setCachedData(cacheKey, movies);
      
      res.json(movies);
    } catch (scrapeError) {
      console.error(`Scraping error for ${chainKey}:`, scrapeError);
      res.status(500).json({ 
        error: 'Failed to fetch movie data',
        details: scrapeError.message 
      });
    }
  } catch (error) {
    console.error('Error in /api/movies route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Cinema Scraper API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('Available endpoints:');
  console.log(`  GET /api/cinemas`);
  console.log(`  GET /api/movies/:cinemaId/:date`);
  console.log(`  GET /api/health`);
});