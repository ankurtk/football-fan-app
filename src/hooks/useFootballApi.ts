import { useState, useEffect } from 'react';
import { footballApi } from '../services/football-api';

interface UseFootballApiOptions {
  onError?: (error: Error) => void;
}

export const useFootballApi = (options?: UseFootballApiOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
    options?.onError?.(error);
  };

  const getLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await footballApi.getLiveMatches();
      return response.data;
    } catch (error) {
      handleError(error as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTeamStats = async (teamId: number) => {
    try {
      setLoading(true);
      const response = await footballApi.getTeamStats(teamId);
      return response.data;
    } catch (error) {
      handleError(error as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getLeagueStandings = async (leagueId: number) => {
    try {
      setLoading(true);
      const response = await footballApi.getLeagueStandings(leagueId);
      return response.data;
    } catch (error) {
      handleError(error as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchPlayers = async (query: string) => {
    try {
      setLoading(true);
      const response = await footballApi.searchPlayers(query);
      return response.data;
    } catch (error) {
      handleError(error as Error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFixtureDetails = async (fixtureId: number) => {
    try {
      setLoading(true);
      const response = await footballApi.getFixtureDetails(fixtureId);
      return response.data;
    } catch (error) {
      handleError(error as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getLiveMatches,
    getTeamStats,
    getLeagueStandings,
    searchPlayers,
    getFixtureDetails,
  };
};