import { fetchFromApi } from './baseApi';
import { filterContent } from './contentFilters';

export const searchMovies = async (query, page = 1) => {
  try {
    const data = await fetchFromApi(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=en-US&include_adult=false&sort_by=popularity.desc`
    );
    
    if (data.results && Array.isArray(data.results)) {
      data.results = filterContent(data.results);
      data.total_results = data.results.length;
    }
    
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const searchTvShows = async (query, page = 1) => {
  try {
    const data = await fetchFromApi(
      `/search/tv?query=${encodeURIComponent(query)}&page=${page}&language=en-US&include_adult=false&sort_by=popularity.desc`
    );
    
    if (data.results && Array.isArray(data.results)) {
      data.results = filterContent(data.results, {
        excludeTalkShows: true
      });
      
      data.total_results = data.results.length;
    }
    
    return data;
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
};