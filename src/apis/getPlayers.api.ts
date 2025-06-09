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

      // Direct call to RapidAPI
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

      // Fix: Check for response.data.response instead of response.data.data
      if (!response.data?.response || response.data.response.length === 0) {
        throw new Error('Player not found');
      }

      // Transform the data to match your UI expectations
      const playerData = response.data.response[0];
      const player = playerData.player || {};

      // Since there are multiple statistics (different leagues), let's pick the most relevant one
      // Priority: 1. Premier League, 2. Most appearances, 3. First available
      let selectedStats = playerData.statistics?.[0] || {};

      if (playerData.statistics && playerData.statistics.length > 1) {
        // Try to find Premier League stats first
        const premierLeagueStats = playerData.statistics.find(stat => stat.league?.id === 39);
        if (premierLeagueStats) {
          selectedStats = premierLeagueStats;
        } else {
          // Find stats with most appearances
          const statsWithApps = playerData.statistics.filter(stat => stat.games?.appearences > 0);
          if (statsWithApps.length > 0) {
            selectedStats = statsWithApps.sort((a, b) => (b.games?.appearences || 0) - (a.games?.appearences || 0))[0];
          }
        }
      }

      const games = selectedStats.games || {};
      const goals = selectedStats.goals || {};
      const cards = selectedStats.cards || {};
      const team = selectedStats.team || {};
      const league = selectedStats.league || {};
      const birth = player.birth || {};

      const transformedPlayer = {
        id: player.id || 0,
        name: player.name || 'Unknown',
        firstname: player.firstname || '',
        lastname: player.lastname || '',
        age: player.age || 0,
        nationality: player.nationality || 'Unknown',
        height: player.height || 'N/A',
        weight: player.weight || 'N/A',
        photo: player.photo || '',
        injured: player.injured || false,
        birth: {
          date: birth.date || '',
          place: birth.place || 'Unknown',
          country: birth.country || 'Unknown'
        },
        statistics: {
          position: games.position || 'N/A',
          appearances: games.appearences || 0,
          lineups: games.lineups || 0,
          minutes: games.minutes || 0,
          rating: games.rating || '0',
          captain: games.captain || false,
          goals: {
            total: goals.total || 0,
            assists: goals.assists || 0,
            saves: goals.saves || 0,
            conceded: goals.conceded || 0
          },
          cards: {
            yellow: cards.yellow || 0,
            red: cards.red || 0
          }
        },
        current_team: {
          id: team.id || 0,
          name: team.name || 'Unknown',
          logo: team.logo || ''
        },
        current_league: {
          id: league.id || 0,
          name: league.name || 'Unknown',
          country: league.country || 'Unknown',
          logo: league.logo || '',
          flag: league.flag || ''
        }
      };

      console.log('Transformed player data:', transformedPlayer);
      return transformedPlayer;

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