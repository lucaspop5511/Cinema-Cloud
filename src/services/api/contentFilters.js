// Content filtering logic for TMDb API

// Keywords and phrases that indicate adult content
const ADULT_CONTENT_KEYWORDS = [
    'sex', 'xxx', 'adult', 'porn', 'erotic', 'erotica', 'nude', 'nudity', 
    'naked', 'sexologist', 'sexual', 'intercourse', 'nsfw', '18+', 'x-rated',
    'desire', 'torture', 'skin', 'young mother', 'fetish', 'lust', 'virgin',
    'horny', 'kinky', 'orgasm', 'sensual', 'seduction', 'provocative', 'brothel',
    'hentai', 'motel', 'lover', 'escort', 'immoral', 'taboo', 'pleasure', 'carnal'
  ];
  
  // Keywords and phrases that indicate talk shows/late night shows
  const TALK_SHOW_KEYWORDS = [
    'late night', 'talk show', 'tonight show', 'late show', 'live with', 
    'daily show', 'conan', 'kimmel', 'colbert', 'fallon', 'leno', 'letterman',
    'ellen', 'oprah', 'view', 'kelly and', 'interview', 'a conversation with',
    'with james corden', 'with jimmy', 'with seth', 'host', 'hosted by'
  ];
  
  // IDs of known talk show genres
  const TALK_SHOW_GENRE_IDS = [10767]; // Talk Show genre ID
  
  // Blacklisted specific IDs known to be problematic
  const BLACKLISTED_IDS = [
    // Adult content
    48993, // "Hotel Desire"
    85220, // "Skin. Like. Sun."
    750196, // "Young Mother 5"
    25975, // "The Girl and the Wooden Horse Torture"
    
    // Talk shows
    1900, // "The Tonight Show with Jay Leno"
    2518, // "Late Night with Conan O'Brien"
    2224, // "The Daily Show"
    1489, // "Die Harald Schmidt Show"
    1991, // "LIVE with Kelly and Mark"
  ];
  
  // Model-enhanced scoring system to detect potential adult content
  const scoreAdultContent = (item) => {
    let score = 0;
    
    // Check title for keywords
    const title = (item.title || item.name || '').toLowerCase();
    const overview = (item.overview || '').toLowerCase();
    
    // Add points for adult content keywords in title
    ADULT_CONTENT_KEYWORDS.forEach(keyword => {
      if (title.includes(keyword)) {
        score += 2; // Higher weight for title matches
      }
      if (overview && overview.includes(keyword)) {
        score += 1; // Lower weight for overview matches
      }
    });
    
    // Add points for specific combinations of genres that often indicate adult content
    if (item.genre_ids && Array.isArray(item.genre_ids)) {
      // Check for specific genre combinations that are suspicious
      const hasRomance = item.genre_ids.includes(10749);
      const hasDrama = item.genre_ids.includes(18);
      
      // Romance + low vote count is often suspicious for indie adult films
      if (hasRomance && item.vote_count < 100) {
        score += 1;
      }
      
      // Romance + drama + low vote count + after 2000 is very suspicious
      if (hasRomance && hasDrama && item.vote_count < 50) {
        const year = item.release_date ? new Date(item.release_date).getFullYear() : 0;
        if (year >= 2000) {
          score += 2;
        }
      }
    }
    
    // Penalize low-vote count items (less mainstream)
    if (item.vote_count < 20) {
      score += 1;
    }
    
    // Add points for specific years that had more adult content
    const year = item.release_date ? new Date(item.release_date).getFullYear() : 
                 item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0;
    
    // 1970s-1980s exploitation era and early 2000s direct-to-video era
    if ((year >= 1970 && year <= 1989) || (year >= 2000 && year <= 2010)) {
      if (item.vote_count < 100) { // If it's obscure from these eras
        score += 1;
      }
    }
    
    // Check if it's one of our blacklisted IDs
    if (BLACKLISTED_IDS.includes(item.id)) {
      score += 10; // Automatic high score for blacklisted items
    }
    
    return score;
  };
  
  // Detect if an item is likely a talk show
  const isTalkShow = (item) => {
    // Check for talk show genre ID
    if (item.genre_ids && item.genre_ids.includes(10767)) {
      return true;
    }
    
    // Check title for talk show keywords
    const title = (item.title || item.name || '').toLowerCase();
    for (const keyword of TALK_SHOW_KEYWORDS) {
      if (title.includes(keyword)) {
        return true;
      }
    }
    
    // Check if it's one of our blacklisted talk show IDs
    if (BLACKLISTED_IDS.includes(item.id)) {
      return true;
    }
    
    return false;
  };
  
  /**
   * Advanced filter for adult content and talk shows
   * @param {Array} results - Results to filter
   * @param {Object} options - Filtering options
   * @returns {Array} - Filtered results
   */
  export const filterContent = (results, options = {}) => {
    if (!results || !Array.isArray(results)) return [];
    
    const { 
      excludeAdultContent = true, 
      excludeTalkShows = true 
    } = options;
    
    return results.filter(item => {
      // Skip talk shows if option is enabled
      if (excludeTalkShows && isTalkShow(item)) {
        return false;
      }
      
      // Skip adult content if option is enabled
      if (excludeAdultContent) {
        // Calculate content score
        const adultContentScore = scoreAdultContent(item);
        
        // Reject items with a high adult content score
        if (adultContentScore >= 3) {
          return false;
        }
        
        // Check for exact title matches with our keywords
        const title = (item.title || item.name || '').toLowerCase();
        for (const keyword of ADULT_CONTENT_KEYWORDS) {
          if (title.includes(keyword)) {
            return false;
          }
        }
      }
      
      // If item passes all filters, include it
      return true;
    });
  };