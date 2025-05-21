const ADULT_CONTENT_KEYWORDS = [
    'sex', 'xxx', 'adult', 'porn', 'erotic', 'erotica', 'nude', 'nudity', 
    'naked', 'sexologist', 'sexual', 'intercourse', 'nsfw', '18+', 'x-rated',
    'desire', 'torture', 'fetish', 'lust', 'virgin', 'hot girls',
    'horny', 'kinky', 'orgasm', 'sensual', 'seduction','clitoris', 'provocative', 'brothel',
    'hentai', 'lover', 'escort', 'immoral', 'taboo', 'pleasure', 'carnal'
  ];
  
const TALK_SHOW_KEYWORDS = [
  'late night', 'talk show', 'tonight show', 'late show', 'live with', 
  'daily show', 'conan', 'kimmel', 'colbert', 'fallon', 'leno', 'letterman',
  'ellen', 'oprah', 'view', 'kelly and', 'interview', 'a conversation with',
  'with james corden', 'with jimmy', 'with seth', 'host', 'hosted by'
];

const BLACKLISTED_TITLES = [
  "Hotel Desire",
  "Skin. Like. Sun.",
  "Young Mother 5",
  "The Girl and the Wooden Horse Torture",
  "The Tonight Show with Jay Leno",
  "Late Night with Conan O'Brien",
  "The Daily Show",
  "Die Harald Schmidt Show",
  "LIVE with Kelly and Mark",
  "The Last Subway",
  "Prozac Nation",
  "Room in Rome"
];

const TALK_SHOW_GENRE_IDS = [10767];

const BLACKLISTED_IDS = [
  48993, 
  85220, 
  750196, 
  25975, 
  22705,
  28468,
  59457,
  50433,
  81529,
  403587,
  1643,
  37247,
  80295,
  9051,
  18311,
  125157,
  32261,
  5203,
  50435,
  5241,
  41003,
  22160,
  61180,
  22160,
  26648,
  23942,
  28892,
  66027,
  26369,
  42726,
  34093,
  3055,
  19610,
  68368,
  11796,
  3681,
  28289,
  2189,
  2264,
  24548,
  63176,
  49934,
  12478,
  10293,
  12116,
  11799,
  37672,
  40687,
  67307,
  47045,
  39506,
  21185,
  2860,
  38702,
  106373,
  18209,
  52741,
  26299,
  42609,
  150023,
  94832,
  22711,
  1421,
  4837,
  18446,
  42084,
  75892,
  38909,
  33666,
  8219,
  39555,
  117269,
  55106,
  114830,
  11145,
  42597,
  10584,
  31304,
  38982,
  64437,
  3427,
  45598,
  98486,
  21148,
  42048,
  59897,
  25010,
  70496,
  42599,
  42694,
  140413,
  98648,
  4988,
  63512,
  42086,
  111965,
  32330,
  71002,
  42234,
  281380,
  64628,
  124352,
  70903,
  86706,
  12585,
  37818,
  105537,
  26879,
  68119,
  74949,
  53234,
  42212,
  32035,
  10237,
  4269,
  136614,
  104759,
  57621,
  24583,
  67539,
  18686,
  36672,
  27450,
  37777,
  257261,
  123817,
  31253,
  82966,
  338187,
  73902,
  131958,
  86006,
  71193,
  673892,
  219210,
  284685,
  101886,
  372095,
  587727,
  408270,
  27,
  50546,
  948549,
  19173,
  11013,
  2321,
  4478,
  11845,
  28422,
  544,
  11012,
  386716,
  50124,
  6557,
  4806,
  73454,
  724109,
  64348,
  71325,
  64586,
  10646,
  12225,
  10497,
  12090,
  28260,
  24935,
  24939,
  402,
  619433,
  698009,
  1631,
  66039,
  258750,
  44983,
  118285,
  
  // Talk shows
  1900, 
  2518, 
  2224,
  1489, 
  1991, 
];

const scoreAdultContent = (item) => {
  let score = 0;
  
  // Check title for keywords
  const title = (item.title || item.name || '').toLowerCase();
  const overview = (item.overview || '').toLowerCase();
  
  ADULT_CONTENT_KEYWORDS.forEach(keyword => {
    if (title.includes(keyword)) {
      score += 2;
    }
    if (overview && overview.includes(keyword)) {
      score += 1;
    }
  });
  
  if (item.genre_ids && Array.isArray(item.genre_ids)) {
    // Check for specific genre combinations that are suspicious
    const hasRomance = item.genre_ids.includes(10749);
    const hasDrama = item.genre_ids.includes(18);
    
    if (hasRomance && item.vote_count < 100) {
      score += 1;
    }
    
    if (hasRomance && hasDrama && item.vote_count < 50) {
      const year = item.release_date ? new Date(item.release_date).getFullYear() : 0;
      if (year >= 2000) {
        score += 2;
      }
    }
  }
  
  if (item.vote_count < 50) {
    score += 1;
  }
  
  const year = item.release_date ? new Date(item.release_date).getFullYear() : 
               item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0;
  
  if ((year >= 1970 && year <= 1989) || (year >= 2000 && year <= 2010)) {
    if (item.vote_count < 100) {
      score += 1;
    }
  }
  
  if (BLACKLISTED_IDS.includes(item.id)) {
    score += 10; // Automatic high score for blacklisted items
  }
  
  return score;
};

const isTalkShow = (item) => {
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
  
  if (BLACKLISTED_IDS.includes(item.id)) {
    return true;
  }
  
  return false;
};

const isBlacklistedTitle = (item) => {
  const title = item.title || item.name || '';
  return BLACKLISTED_TITLES.some(blacklistedTitle => 
    title.toLowerCase() === blacklistedTitle.toLowerCase()
  );
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
    excludeTalkShows = true,
    excludeBlacklistedTitles = true
  } = options;
  
  return results.filter(item => {
    if (excludeBlacklistedTitles && isBlacklistedTitle(item)) {
      return false;
    }
    
    if (excludeTalkShows && isTalkShow(item)) {
      return false;
    }
    
    // Skip adult content if option is enabled
    if (excludeAdultContent) {
      // Calculate content score
      const adultContentScore = scoreAdultContent(item);
      
      // Reject items with a high score
      if (adultContentScore >= 3) {
        return false;
      }
      
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