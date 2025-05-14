const puppeteer = require('puppeteer');

/**
 * Scrape Cinema City for movies and showtimes
 * @param {Object} location - Cinema location object
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Array of movie objects with showtimes
 */
async function scrapeCinemaCity(location, date) {
  console.log(`Scraping Cinema City ${location.name} for ${date}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set a realistic user agent and viewport
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1366, height: 768 });
    
    // Construct URL - Cinema City uses a specific URL pattern
    const url = `https://www.cinemacity.ro/cinemas/${location.slug}/${location.id}#/buy-tickets-by-cinema?in-cinema=${location.id}&at=${date}&view-mode=list`;
    
    console.log(`Navigating to: ${url}`);
    
    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for the page to load completely
    await page.waitForTimeout(3000);
    
    // Try different selectors as Cinema City might use dynamic loading
    const movies = await page.evaluate(() => {
      const movieElements = document.querySelectorAll('[data-testid="movie-card"], .movie-card, .event-container, .qb-movie');
      const results = [];
      
      movieElements.forEach(element => {
        try {
          let title = '';
          let duration = 0;
          let genre = '';
          let poster = '';
          let showtimes = [];
          
          // Try different selectors for title
          const titleElement = element.querySelector('[data-testid="movie-title"], .movie-title, .event-title, h3, .qb-movie-title');
          if (titleElement) {
            title = titleElement.textContent.trim();
          }
          
          // Try to find duration
          const durationElement = element.querySelector('[data-testid="movie-duration"], .duration, .movie-runtime');
          if (durationElement) {
            const durationText = durationElement.textContent;
            const durationMatch = durationText.match(/(\d+)\s*min/i);
            if (durationMatch) {
              duration = parseInt(durationMatch[1]);
            }
          }
          
          // Try to find genre
          const genreElement = element.querySelector('[data-testid="movie-genre"], .genre, .movie-genre');
          if (genreElement) {
            genre = genreElement.textContent.trim();
          }
          
          // Try to find poster
          const posterElement = element.querySelector('img');
          if (posterElement) {
            poster = posterElement.src || posterElement.getAttribute('data-src') || '';
          }
          
          // Try to find showtimes
          const showtimeElements = element.querySelectorAll('[data-testid="showtime"], .showtime, .time-button, .qb-btn');
          showtimeElements.forEach(timeEl => {
            const timeText = timeEl.textContent.trim();
            const timeMatch = timeText.match(/(\d{1,2}):(\d{2})/);
            if (timeMatch) {
              showtimes.push(`${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`);
            }
          });
          
          // Only add if we have at least a title
          if (title && title.length > 0) {
            results.push({
              title,
              duration,
              genre: genre || 'Unknown',
              poster: poster || '',
              showtimes
            });
          }
        } catch (error) {
          console.log('Error processing movie element:', error);
        }
      });
      
      return results;
    });
    
    console.log(`Found ${movies.length} movies for Cinema City ${location.name}`);
    
    // If no movies found with primary method, try alternative approach
    if (movies.length === 0) {
      console.log('Trying alternative scraping method...');
      
      // Wait a bit more for dynamic content
      await page.waitForTimeout(2000);
      
      // Try to find any container with movies
      const alternativeMovies = await page.evaluate(() => {
        const allElements = document.querySelectorAll('div, section, article');
        const movieData = [];
        
        for (const element of allElements) {
          const text = element.textContent;
          
          // Look for elements that might contain movie titles
          if (text && text.length > 5 && text.length < 100) {
            // Check if it looks like a movie title
            const hasTime = /\d{1,2}:\d{2}/.test(text);
            const hasMovieWords = /film|movie|cinema/i.test(text);
            
            if (hasTime || text.includes(':')) {
              // This might be a showtime area
              const showtimes = text.match(/\d{1,2}:\d{2}/g) || [];
              if (showtimes.length > 0) {
                // Look for nearby title
                const parent = element.closest('div, section, article');
                const titleEl = parent?.querySelector('h1, h2, h3, h4, .title, .movie-title');
                if (titleEl && titleEl.textContent.trim().length > 2) {
                  movieData.push({
                    title: titleEl.textContent.trim(),
                    showtimes: showtimes,
                    duration: 0,
                    genre: 'Unknown',
                    poster: ''
                  });
                }
              }
            }
          }
        }
        
        return movieData;
      });
      
      if (alternativeMovies.length > 0) {
        console.log(`Found ${alternativeMovies.length} movies with alternative method`);
        return alternativeMovies;
      }
    }
    
    return movies;
    
  } catch (error) {
    console.error(`Error scraping Cinema City ${location.name}:`, error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { scrapeCinemaCity };