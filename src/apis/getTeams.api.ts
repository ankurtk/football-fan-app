import axios from 'axios';

export interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
  crest: string; // Alias for compatibility
  venue: string;
  venue_details?: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

// Use environment variable that works in both dev and production
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '' : 'http://localhost:5000'
);

export const teamService = {
  getTeams: async (league?: number, season: number = 2024) => {
    try {
      const params = new URLSearchParams();
      if (league) params.append('league', league.toString());
      params.append('season', season.toString());

      const response = await axios.get(`${API_URL}/api/teams?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  getTeamById: async (id: number, season: number = 2024, league: number = 39) => {
    try {
      const response = await axios.get(`${API_URL}/api/teams?id=${id}&season=${season}&league=${league}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  },

  searchTeams: async (name: string) => {
    try {
      const params = new URLSearchParams();
      params.append('search', name);

      const response = await axios.get(`${API_URL}/api/teams?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching teams:', error);
      throw error;
    }
  }
};