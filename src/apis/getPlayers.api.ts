import axios from 'axios';

export interface Player {
  id: number;
  name: string;
  firstname?: string;
  lastname?: string;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  photo: string;
  injured: boolean;
  birth: {
    date: string;
    place: string;
    country: string;
  };
  statistics: {
    position: string;
    appearances: number;
    lineups: number;
    minutes: number | null;  // Allow null
    rating: string | null;   // Allow null
    captain: boolean;
    goals: {
      total: number | null;
      assists: number | null;
      saves: number | null;
      conceded: number | null;
    };
    cards: {
      yellow: number | null;
      red: number | null;
    };
  };
  current_team: {
    id: number;
    name: string;
    logo: string;
  };
  current_league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
}

const API_URL = 'http://localhost:5000/api';

export const playerService = {
  getPlayersByTeam: async (teamId: number, season: number = 2024) => {
    try {
      const response = await axios.get(`${API_URL}/teams/${teamId}/players?season=${season}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },

  getPlayerById: async (playerId: number, season: number = 2024) => {
    try {
      const response = await axios.get(`${API_URL}/players/${playerId}?season=${season}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  },

  searchPlayers: async (name: string, season: number = 2024) => {
    try {
      const response = await axios.get(`${API_URL}/players/search?name=${encodeURIComponent(name)}&season=${season}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  },

  getTeamStatistics: async (teamId: number, leagueId: number = 39, season: number = 2024) => {
    try {
      const response = await axios.get(`${API_URL}/teams/${teamId}/statistics?league=${leagueId}&season=${season}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team statistics:', error);
      throw error;
    }
  }
};