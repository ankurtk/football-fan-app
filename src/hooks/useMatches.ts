import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Match {
  id: number;
  home_team: {
    id: number;
    name: string;
    venue: string;  // Added venue for home team
    area: string;
  };
  away_team: {
    id: number;
    name: string;
  };
  competition: string;
  match_date: string;
}

// This is a generic hook for fetching matches with various filters
export const useMatches = (filters?: { team_name?: string }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters?.team_name) {
          params.append('team_name', filters.team_name);
        }

        const response = await axios.get(`http://localhost:5000/api/matches?${params}`);
        setMatches(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch matches');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [filters?.team_name]);

  return { matches, loading, error };
};