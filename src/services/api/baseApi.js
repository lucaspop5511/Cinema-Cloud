const API_KEY = '7c3176acaa14acc2e99f4b84f8c73781';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YzMxNzZhY2FhMTRhY2MyZTk5ZjRiODRmOGM3Mzc4MSIsIm5iZiI6MTc0MzU4NzAxMC4wNjA5OTk5LCJzdWIiOiI2N2VkMDZjMjhmZWQzZjAyMzZhYWU1NTgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.kTWh-vKzrU-QHAUgkVOh7hMvhcJX0Z3KPqJfRFsbs7I';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const fetchFromApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from API (${endpoint}):`, error);
    throw error;
  }
};

export const getImageUrl = (path) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${path}`;
};

export { 
  API_KEY, 
  ACCESS_TOKEN, 
  BASE_URL, 
  IMAGE_BASE_URL 
};