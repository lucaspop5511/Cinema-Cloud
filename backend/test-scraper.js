const { scrapeCinemaCity } = require('./scrapers/cinemacity');
const { scrapeMovieplex } = require('./scrapers/movieplex');
const { CINEMAS } = require('./config/cinemas');

async function testScrapers() {
  console.log('🎬 Testing Romanian Cinema Scrapers\n');
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  console.log(`Testing for date: ${today}\n`);
  
  console.log('='.repeat(50));
  console.log('Testing Cinema City');
  console.log('='.repeat(50));
  
  // Test Cinema City (Cluj location)
  const cinemaCityLocation = CINEMAS['cinema-city'].locations[0]; // Cluj VIVO
  try {
    console.log(`\nTesting: ${cinemaCityLocation.name}`);
    const cinemaCityMovies = await scrapeCinemaCity(cinemaCityLocation, today);
    
    if (cinemaCityMovies.length > 0) {
      console.log(`✅ Success! Found ${cinemaCityMovies.length} movies`);
      console.log('\nSample movies:');
      cinemaCityMovies.slice(0, 3).forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   Duration: ${movie.duration} min`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Showtimes: ${movie.showtimes.join(', ')}`);
        console.log();
      });
    } else {
      console.log('❌ No movies found');
    }
  } catch (error) {
    console.error('❌ Error testing Cinema City:', error.message);
  }
  
  console.log('='.repeat(50));
  console.log('Testing Movieplex');
  console.log('='.repeat(50));
  
  // Test Movieplex (București location)
  const movieplexLocation = CINEMAS['movieplex'].locations[0]; // Plaza Romania
  try {
    console.log(`\nTesting: ${movieplexLocation.name}`);
    const movieplexMovies = await scrapeMovieplex(movieplexLocation, today);
    
    if (movieplexMovies.length > 0) {
      console.log(`✅ Success! Found ${movieplexMovies.length} movies`);
      console.log('\nSample movies:');
      movieplexMovies.slice(0, 3).forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title}`);
        console.log(`   Duration: ${movie.duration} min`);
        console.log(`   Genre: ${movie.genre}`);
        console.log(`   Showtimes: ${movie.showtimes.join(', ')}`);
        console.log();
      });
    } else {
      console.log('❌ No movies found');
    }
  } catch (error) {
    console.error('❌ Error testing Movieplex:', error.message);
  }
  
  console.log('\n='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  console.log('If you see movies listed above, the scrapers are working!');
  console.log('If no movies are found, the websites might have changed their structure.');
  console.log('Check the console for any error messages for debugging info.');
  console.log('\nNext steps:');
  console.log('1. Start the server: npm run dev');
  console.log('2. Test API: http://localhost:3001/api/health');
  console.log('3. Get cinemas: http://localhost:3001/api/cinemas');
  console.log(`4. Get movies: http://localhost:3001/api/movies/cinema-city-1815/${today}`);
}

// Handle any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the test
if (require.main === module) {
  testScrapers()
    .then(() => {
      console.log('\nTest completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testScrapers };