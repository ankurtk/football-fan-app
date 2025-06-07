import axios from 'axios';

export interface Competition {
  id: number;
  name: string;
  code: string;
  area: string;
  plan: string;
  current_season?: unknown;
}

const API_URL = 'http://localhost:5000/api';

export const competitionService = {
  getCompetitions: async () => {
    try {
      const response = await axios.get(`${API_URL}/competitions`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error;
    }
  }
};