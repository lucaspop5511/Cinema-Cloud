const puppeteer = require('puppeteer');
const axios = require('axios');

/**
 * Debug function to log all found times on the page
 */
async function debugMovieplexPage(page) {
  const debugInfo = await page.evaluate(() => {
    const allTimes = [];
    const allText = document.body.innerText;
    
    // Find all time patterns in the entire page
    const timeMatches = allText.match(/\d{1,2}:\d{2}/g);
    if (timeMatches) {
      timeMatches.forEach(time => {
        if (!allTimes.includes(time)) {
          allTimes.push(time);
        }
      });
    }
    
    // Sort times
    allTimes.sort();
    
    return {
      totalTimes: allTimes.length,
      times: allTimes,
      pageTitle: document.title,
      currentDate: document.querySelector('.active, .selected, .current')?.textContent || 'not found'
    };
  });
  
  console.log('=== MOVIEPLEX DEBUG INFO ===');
  console.log(`Page title: ${debugInfo.pageTitle}`);
  console.log(`Current date selector: ${debugInfo.currentDate}`);
  console.log(`Total times found on page: ${debugInfo.totalTimes}`);
  console.log(`All times: ${debugInfo.times.join(', ')}`);
  console.log('===========================');
  
  return debugInfo;
}

/**
 * Scrape Movieplex for movies and showtimes
 * @param {Object} location - Cinema location object
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Array of movie objects with showtimes
 */
async function scrapeMovieplex(location, date) {
  console.log(`Scraping Movieplex ${location.name} for ${date}`);
  
  // First try to find API endpoints
  try {
    const apiMovies = await scrapeMovieplexAPI(location, date);
    if (apiMovies.length > 0) {
      return apiMovies;
    }
  } catch (error) {
    console.log('API method failed, trying HTML scraping...', error.message);
  }
  
  // Fallback to HTML scraping
  return await scrapeMovieplexHTML(location, date);
}

/**
 * Try to scrape Movieplex using potential API endpoints
 */
async function scrapeMovieplexAPI(location, date) {
  const possibleEndpoints = [
    `https://www.movieplex.ro/api/showtimes?date=${date}&location=${location.slug}`,
    `https://www.movieplex.ro/api/program?date=${date}`,
    `https://www.movieplex.ro/wp-json/movieplex/v1/showtimes?date=${date}`
  ];
  
  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`Trying API endpoint: ${endpoint}`);
      
      const response = await axios.get(endpoint, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(movie => ({
          title: movie.title || movie.name || '',
          duration: parseInt(movie.duration) || 0,
          genre: movie.genre || 'Unknown',
          poster: movie.poster || movie.image || '',
          showtimes: movie.showtimes || []
        }));
      }
    } catch (error) {
      // Continue to next endpoint
      continue;
    }
  }
  
  return [];
}

/**
 * Scrape Movieplex using HTML parsing - DEBUG VERSION
 */
async function scrapeMovieplexHTML(location, date) {
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
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1366, height: 768 });
    
    // Try the exact URL structure from the official site
    const url = `https://www.movieplex.ro/program`;
    
    console.log(`Navigating to: ${url}`);
    console.log(`Target date: ${date}`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait extra time for dynamic content
    await page.waitForTimeout(3000);
    
    // Debug: Log all times found on the page
    await debugMovieplexPage(page);
    
    // Try to select the correct date if date picker exists
    try {
      console.log('Looking for date picker...');
      
      // Look for tomorrow's date in various formats
      const tomorrow = new Date(date);
      const dayOfMonth = tomorrow.getDate();
      
      // Try to click on the correct date
      const dateSelectors = [
        `[data-date="${date}"]`,
        `[data-day="${dayOfMonth}"]`,
        `.date-${dayOfMonth}`,
        `button:contains("${dayOfMonth}")`,
        `a:contains("${dayOfMonth}")`
      ];
      
      for (const selector of dateSelectors) {
        try {
          const dateElement = await page.$(selector);
          if (dateElement) {
            console.log(`Found date selector: ${selector}`);
            await dateElement.click();
            await page.waitForTimeout(2000);
            break;
          }
        } catch (e) {
          // Continue trying other selectors
        }
      }
    } catch (error) {
      console.log('No date picker found or date selection failed:', error.message);
    }
    
    // Debug again after date selection
    console.log('After date selection:');
    await debugMovieplexPage(page);
    
    // Try different approaches to extract showtimes
    const movies = await page.evaluate(() => {
      const movieData = new Map();
      
      // Look for various possible movie containers
      const movieSelectors = [
        '.movie-card',
        '.film-card', 
        '.movie-item',
        '.program-item',
        '.show-item',
        '.event-item'
      ];
      
      let movieElements = [];
      for (const selector of movieSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          movieElements = Array.from(elements);
          console.log(`Found ${elements.length} movies with selector: ${selector}`);
          break;
        }
      }
      
      movieElements.forEach(element => {
        try {
          let title = '';
          let duration = 0;
          let genre = '';
          let poster = '';
          let showtimes = [];
          
          // Extract title - try multiple selectors
          const titleSelectors = [
            '.movie-title', 
            '.film-title', 
            'h2', 
            'h3', 
            '.title',
            '.movie-name',
            '.film-name'
          ];
          
          for (const sel of titleSelectors) {
            const titleEl = element.querySelector(sel);
            if (titleEl && titleEl.textContent.trim()) {
              title = titleEl.textContent.trim();
              break;
            }
          }
          
          // Extract poster
          const posterElement = element.querySelector('img');
          if (posterElement) {
            poster = posterElement.src || posterElement.getAttribute('data-src') || '';
          }
          
          // Extract showtimes - IMPROVED APPROACH
          const showtimeSelectors = [
            '.showtime',
            '.time',
            '.hour',
            '.screening-time',
            '.btn-time',
            '.time-button',
            '.schedule-time',
            'button[class*="time"]',
            'span[class*="time"]',
            // Look for buttons with time patterns
            'button',
            'span',
            'div[class*="hour"]'
          ];
          
          const allTimeElements = [];
          
          // Try each selector
          for (const sel of showtimeSelectors) {
            const elements = element.querySelectorAll(sel);
            elements.forEach(el => {
              if (el.textContent && el.textContent.match(/\d{1,2}:\d{2}/)) {
                allTimeElements.push(el);
              }
            });
          }
          
          // Extract times and clean them
          allTimeElements.forEach(timeEl => {
            const timeText = timeEl.textContent.trim();
            // Extract all time patterns like "11:30", "17:00", etc.
            const timeMatches = timeText.match(/\d{1,2}:\d{2}/g);
            if (timeMatches) {
              timeMatches.forEach(time => {
                if (!showtimes.includes(time)) {
                  showtimes.push(time);
                }
              });
            }
          });
          
          // Also look for times in the entire element text
          const elementText = element.textContent;
          const allTimes = elementText.match(/\d{1,2}:\d{2}/g);
          if (allTimes) {
            allTimes.forEach(time => {
              if (!showtimes.includes(time)) {
                showtimes.push(time);
              }
            });
          }
          
          // Sort showtimes
          showtimes.sort();
          
          if (title && title.length > 0) {
            movieData.set(title, {
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
      
      return Array.from(movieData.values());
    });
    
    console.log(`Found ${movies.length} movies for Movieplex ${location.name}`);
    
    // Enhanced fallback method if no movies found
    if (movies.length === 0) {
      console.log('Trying enhanced fallback method...');
      
      const fallbackMovies = await page.evaluate(() => {
        const results = [];
        
        // Look for any text containing time patterns
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        const movieTimes = new Map();
        let node;
        
        while (node = walker.nextNode()) {
          const text = node.textContent;
          const timePattern = /\d{1,2}:\d{2}/g;
          const times = text.match(timePattern);
          
          if (times && times.length > 0) {
            // Look for nearby title elements
            let element = node.parentElement;
            let title = '';
            
            // Search up the DOM tree for movie titles
            for (let i = 0; i < 5 && element; i++) {
              const possibleTitle = element.querySelector('h1, h2, h3, h4, .title, .movie-title, .film-title');
              if (possibleTitle && possibleTitle.textContent.trim().length > 3) {
                title = possibleTitle.textContent.trim();
                break;
              }
              element = element.parentElement;
            }
            
            if (title) {
              if (!movieTimes.has(title)) {
                movieTimes.set(title, new Set());
              }
              times.forEach(time => movieTimes.get(title).add(time));
            }
          }
        }
        
        // Convert to movie objects
        for (const [title, timeSet] of movieTimes.entries()) {
          results.push({
            title,
            showtimes: Array.from(timeSet).sort(),
            duration: 0,
            genre: 'Unknown',
            poster: ''
          });
        }
        
        return results;
      });
      
      if (fallbackMovies.length > 0) {
        console.log(`Found ${fallbackMovies.length} movies with enhanced fallback method`);
        return fallbackMovies;
      }
    }
    
    return movies;
    
  } catch (error) {
    console.error(`Error scraping Movieplex ${location.name}:`, error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { scrapeMovieplex };