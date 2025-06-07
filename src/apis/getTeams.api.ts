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

const API_URL = 'http://localhost:5000/api';

export const teamService = {
  // Updated to use RapidAPI by default
  getTeams: async (league?: number, season: number = 2024) => {
    try {
      const params = new URLSearchParams();
      params.append('use_rapidapi', 'true');
      if (league) params.append('league', league.toString());
      params.append('season', season.toString());

      const response = await axios.get(`${API_URL}/teams?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  getTeamById: async (id: number, season: number = 2024) => {
    try {
      const params = new URLSearchParams();
      params.append('use_rapidapi', 'true');
      params.append('season', season.toString());

      const response = await axios.get(`${API_URL}/teams/${id}?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team:', error);
      throw error;
    }
  }
};