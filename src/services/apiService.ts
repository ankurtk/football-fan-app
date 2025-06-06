import axios from 'axios';

// Define the base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor for handling errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Matches API
export const getMatches = async (options = {}) => {
  try {
    const response = await apiClient.get('/matches', { params: options });
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getFeaturedMatches = async () => {
  try {
    const response = await apiClient.get('/matches/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured matches:', error);
    throw error;
  }
};

export const getMatchById = async (id: number) => {
  try {
    const response = await apiClient.get(`/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching match with id ${id}:`, error);
    throw error;
  }
};

// Teams API
export const getTeams = async (options = {}) => {
  try {
    const response = await apiClient.get('/teams', { params: options });
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeamById = async (id: number, season: number = 2024) => {
  try {
    // Change from path parameter to query parameter
    const response = await axios.get(`${API_URL}/api/teams?id=${id}&season=${season}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

export const getTeamMatches = async (teamId: number, options = {}) => {
  try {
    const response = await apiClient.get(`/teams/${teamId}/matches`, { params: options });
    return response.data;
  } catch (error) {
    console.error(`Error fetching matches for team with id ${teamId}:`, error);
    throw error;
  }
};

export const getTeamPlayers = async (teamId: number, season: number = 2024) => {
  try {
    // Use query parameters
    const response = await axios.get(`${API_URL}/api/teams?teamId=${teamId}&type=players&season=${season}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching team players:', error);
    throw error;
  }
};

// Players API
export const getPlayerById = async (id:number) => {
  try {
    const response = await apiClient.get(`/players/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player with id ${id}:`, error);
    throw error;
  }
};

// Areas API
export const getAreas = async (options = {}) => {
  try {
    const response = await apiClient.get('/areas', { params: options });
    return response.data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

export const getAreaById = async (id:number) => {
  try {
    const response = await apiClient.get(`/areas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching area with id ${id}:`, error);
    throw error;
  }
};

// Competitions API
export const getCompetitions = async (options = {}) => {
  try {
    const response = await apiClient.get('/competitions', { params: options });
    return response.data;
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw error;
  }
};

export const getCompetitionById = async (id:number) => {
  try {
    const response = await apiClient.get(`/competitions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching competition with id ${id}:`, error);
    throw error;
  }
};