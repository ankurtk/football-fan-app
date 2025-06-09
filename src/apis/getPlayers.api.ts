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
    minutes: number | null;
    rating: string | null;
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

// Use environment variable that works in both dev and production
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '' : 'http://localhost:5000'
);

export const playerService = {
  getPlayersByTeam: async (teamId: number, season: number = 2024, league: number = 39) => {
    try {
      // Add console.log for debugging
      console.log(`Fetching players for team ${teamId}, season ${season}, league ${league}`);

      // Make sure API_URL is correct
      const response = await axios.get(`${API_URL}/api/teams`, {
        params: {
          teamId,
          type: 'players',
          season,
          league
        }
      });

      // Log response for debugging
      console.log(`Got ${response.data?.data?.length || 0} players from API`);

      return response.data.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },

  getPlayerById: async (playerId: number, season: number = 2024, league: number = 39) => {
    try {
      console.log(`Getting player ${playerId} for season ${season}, league ${league}`);
      const response = await axios.get(`${API_URL}/api/players/${playerId}?season=${season}&league=${league}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  },

  searchPlayers: async (name: string, season: number = 2024) => {
    try {
      const response = await axios.get(`${API_URL}/api/players/search?name=${encodeURIComponent(name)}&season=${season}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  }
};