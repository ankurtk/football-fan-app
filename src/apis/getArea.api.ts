import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Area {
  id: number;
  name: string;
  country_code: string;
  continent?: string;
  flag?: string;
  leagues?: string[];
  upcomingMatches?: number;
}

export const areaService = {
  getAreas: async (search?: string) => {
    const response = await axios.get(`${API_URL}/areas`, {
      params: { search }
    });
    return response.data.data;
  },

  getAreaById: async (id: number) => {
    const response = await axios.get(`${API_URL}/areas/${id}`);
    return response.data;
  },

  searchAreas: async (searchTerm: string) => {
    const response = await axios.get(`${API_URL}/areas/search`, {
      params: { q: searchTerm }
    });
    return response.data.data;
  }
};