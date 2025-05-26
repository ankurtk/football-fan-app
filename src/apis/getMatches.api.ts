import axios from 'axios';

export interface Match {
  id: number;
  home_team: {
    id: number;
    name: string;
  };
  away_team: {
    id: number;
    name: string;
  };
  competition: string;
  match_date: string;
}

const API_URL = 'http://localhost:5000/api';

export const matchService = {
  getMatches: async (teamName?: string) => {
    try {
      const response = await axios.get(`${API_URL}/matches`, {
        params: { team_name: teamName }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  getMatchById: async (id: number) => {
    const response = await axios.get(`${API_URL}/matches/${id}`);
    return response.data.data;
  }
};