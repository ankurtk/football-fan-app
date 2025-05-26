import apiClient from './apiClient';
import { Area, Competition, Team, Player, Match } from '../types/api';

// Teams API
export const getTeams = async (params?: { 
  area?: string; 
  competition?: string; 
  name?: string; 
}): Promise<Team[]> => {
  const { data } = await apiClient.get('/teams', { params });
  return data;
};

export const getTeamById = async (id: string): Promise<Team> => {
  const { data } = await apiClient.get(`/teams/${id}`);
  return data;
};

export const getTeamMatches = async (teamId: string, params?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Match[]> => {
  const { data } = await apiClient.get(`/teams/${teamId}/matches`, { params });
  return data;
};

// Players API
export const getPlayers = async (params?: {
  team?: string;
  nationality?: string;
  name?: string;
  position?: string;
}): Promise<Player[]> => {
  const { data } = await apiClient.get('/players', { params });
  return data;
};

export const getPlayerById = async (id: string): Promise<Player> => {
  const { data } = await apiClient.get(`/players/${id}`);
  return data;
};

// Matches API
export const getMatches = async (params?: {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  team?: string;
  competition?: string;
}): Promise<Match[]> => {
  const { data } = await apiClient.get('/matches', { params });
  return data;
};

export const getFeaturedMatches = async (): Promise<Match[]> => {
  const { data } = await apiClient.get('/matches/featured');
  return data;
};

export const getMatchById = async (id: string): Promise<Match> => {
  const { data } = await apiClient.get(`/matches/${id}`);
  return data;
};

// Areas API
export const getAreas = async (params?: {
  continent?: string;
  name?: string;
}): Promise<Area[]> => {
  const { data } = await apiClient.get('/areas', { params });
  return data;
};

export const getAreaById = async (id: string): Promise<Area> => {
  const { data } = await apiClient.get(`/areas/${id}`);
  return data;
};

// Competitions API
export const getCompetitions = async (params?: {
  area?: string;
  name?: string;
}): Promise<Competition[]> => {
  const { data } = await apiClient.get('/competitions', { params });
  return data;
};

export const getCompetitionById = async (id: string): Promise<Competition> => {
  const { data } = await apiClient.get(`/competitions/${id}`);
  return data;
};

export const getCompetitionMatches = async (id: string, params?: {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}): Promise<Match[]> => {
  const { data } = await apiClient.get(`/competitions/${id}/matches`, { params });
  return data;
};

export const getCompetitionTeams = async (id: string): Promise<Team[]> => {
  const { data } = await apiClient.get(`/competitions/${id}/teams`);
  return data;
};