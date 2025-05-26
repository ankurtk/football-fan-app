import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Team {
  id: number;
  name: string;
  area: string;
  founded: number;
  venue: string;
}

export const teamService = {
  getTeams: async (searchTerm?: string) => {
    try {
      const response = await axios.get(`${API_URL}/teams`, {
        params: { name: searchTerm }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  getTeamById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team details:', error);
      throw error;
    }
  }
};