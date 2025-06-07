import axios from "axios";

// In production, API calls will go to the same domain
const API_URL = process.env.NODE_ENV === 'production'
  ? '' // Same domain in production
  : 'http://localhost:5000';

export const matchService = {
  getLiveMatches: async (league?: number, teamName?: string) => {
    const params = new URLSearchParams();
    if (league && league !== 0) params.append('league', league.toString());
    if (teamName) params.append('team_name', teamName);

    const response = await axios.get(`${API_URL}/api/matches/live?${params}`);
    return response.data.data;
  },
  // ... other methods
};