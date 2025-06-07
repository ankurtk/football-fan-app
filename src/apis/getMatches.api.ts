import axios from 'axios';

// Use environment variable that works in both dev and production
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '' : 'http://localhost:5000'
);

export interface Match {
  id: number;
  competition: string;
  competition_id: number;
  match_date: string;
  status: string;
  status_short: string;
  venue: string;
  referee: string;
  round: string;
  home_team: {
    id: number;
    name: string;
    logo: string;
    crest: string;
  };
  away_team: {
    id: number;
    name: string;
    logo: string;
    crest: string;
  };
  score: {
    home: number | null;
    away: number | null;
  };
  score_details: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export const matchService = {
  getMatches: async (league: number = 39, type: string = 'all', teamName?: string, season: number = 2024) => {
    try {
      const params = new URLSearchParams();
      params.append('league', league.toString());
      params.append('season', season.toString());
      params.append('type', type);
      if (teamName) {
        params.append('team_name', teamName);
      }

      const response = await axios.get(`${API_URL}/api/matches?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  getTodayMatches: async (league?: number) => {
    try {
      const params = league ? `?league=${league}` : '';
      const response = await axios.get(`${API_URL}/api/matches/today${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching today\'s matches:', error);
      throw error;
    }
  },

  getMatchesByDate: async (date: string, league?: number) => {
    try {
      const params = league ? `?league=${league}` : '';
      const response = await axios.get(`${API_URL}/api/matches/date/${date}${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching matches by date:', error);
      throw error;
    }
  },

  getTeamMatches: async (teamId: number, last: number = 5, next: number = 5) => {
    try {
      const response = await axios.get(`${API_URL}/api/matches/team/${teamId}?last=${last}&next=${next}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team matches:', error);
      throw error;
    }
  },

  getLiveMatches: async (league?: number, teamName?: string) => {
    const params = new URLSearchParams();
    if (league && league !== 0) params.append('league', league.toString());
    if (teamName) params.append('team_name', teamName);

    const response = await axios.get(`${API_URL}/api/matches/live?${params}`);
    return response.data.data;
  },

  getUpcomingMatches: async (league: number = 39) => {
    try {
      const response = await axios.get(`${API_URL}/api/matches?league=${league}&type=upcoming`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      throw error;
    }
  },

  getRecentMatches: async (league: number = 39) => {
    try {
      const response = await axios.get(`${API_URL}/api/matches?league=${league}&type=recent`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent matches:', error);
      throw error;
    }
  }
};