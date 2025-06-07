import { useState, useEffect, useCallback } from 'react';
import { matchService, Match } from '../apis/getMatches.api';

// This is a generic hook for fetching matches with various filters
export const useMatches = (filters?: {
  league?: number;
  type?: 'today' | 'upcoming' | 'live' | 'recent' | 'all';
  team_name?: string;
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Match[] = [];

      if (filters?.type === 'today') {
        if (!filters.league || filters.league === 0) {
          // Get today's matches from multiple major leagues
          const leagues = [39, 140, 135, 78, 61];
          const allTodayMatches: Match[] = [];

          for (const league of leagues) {
            try {
              const leagueMatches = await matchService.getTodayMatches(league);
              allTodayMatches.push(...(leagueMatches || []));
            } catch (err) {
              console.warn(`Failed to fetch today's matches for league ${league}`);
            }
          }
          data = allTodayMatches;
        } else {
          data = await matchService.getTodayMatches(filters.league);
        }

      } else if (filters?.type === 'upcoming') {
        if (!filters.league || filters.league === 0) {
          // Get upcoming matches from multiple major leagues
          const leagues = [39, 140, 135, 78, 61];
          const allUpcomingMatches: Match[] = [];

          for (const league of leagues) {
            try {
              const leagueMatches = await matchService.getUpcomingMatches(league);
              allUpcomingMatches.push(...(leagueMatches || []));
            } catch (err) {
              console.warn(`Failed to fetch upcoming matches for league ${league}`);
            }
          }
          data = allUpcomingMatches;
        } else {
          data = await matchService.getUpcomingMatches(filters.league);
        }

      } else if (filters?.type === 'live') {
        // Hybrid approach for live matches
        data = await matchService.getLiveMatches(filters.league);

      } else {
        // Default: get matches for specific league or Premier League
        const league = filters?.league || 39;
        const type = filters?.type || 'all';
        data = await matchService.getMatches(league, type, filters?.team_name);
      }

      setMatches(data || []);
      setLastFetched(new Date());
    } catch (err) {
      setError('Failed to fetch matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  }, [filters?.league, filters?.type, filters?.team_name]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Return refresh function along with other data
  return {
    matches,
    loading,
    error,
    lastFetched,
    refetch: fetchMatches // This allows manual refresh
  };
};

export type { Match };