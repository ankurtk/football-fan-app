import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  team_id: number;
}


export const playerService = {
  getPlayerById: async (id: number): Promise<Player> => {
    try {
      const response = await axios.get(`${API_URL}/players/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  },

  getPlayers: async (filters?: { team_id?: number; name?: string }) => {
    try {
      const response = await axios.get(`${API_URL}/players`, { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }
};