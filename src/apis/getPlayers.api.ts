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

  getPlayerById: async (playerId: number, season: number = 2024) => {
    try {
      console.log(`Getting player ${playerId} for season ${season}`);

      // Temporary: Direct RapidAPI call with proper environment variable
      const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/players', {
        params: {
          id: playerId,
          season: season
        },
        headers: {
          'X-RapidAPI-Key': 'b6a917c7bcmsh7fbd02bc5446134p127c98jsnd231ce01822f',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });

      if (!response.data?.response || response.data.response.length === 0) {
        throw new Error('Player not found');
      }

      // Transform the data
      const playerData = response.data.response[0];
      const player = playerData.player || {};

      return {
        id: player.id,
        name: player.name,
        firstname: player.firstname,
        lastname: player.lastname,
        age: player.age,
        photo: player.photo,
        nationality: player.nationality,
        height: player.height,
        weight: player.weight,
        // Add other fields as needed
      };

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