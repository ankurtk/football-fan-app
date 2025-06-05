import axios from 'axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface TeamStats {
  matches: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
  };
  goals: {
    for: number;
    against: number;
  };
}

interface Player {
  id: number;
  name: string;
  age: number;
  nationality: string;
  position: string;
}

interface Match {
  id: number;
  date: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
    score?: number;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
    score?: number;
  };
  league: {
    id: number;
    name: string;
    country: string;
  };
}

interface LeagueStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

class FootballApiService {
  private api;
  private rateLimitDelay = 1000; // 1 second between requests
  private lastRequestTime = 0;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api-football-v1.p.rapidapi.com/v3',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 429:
              throw new Error('Rate limit exceeded. Please try again later.');
            case 403:
              throw new Error('API key is invalid or expired.');
            default:
              throw new Error(data.message || 'An error occurred while fetching data.');
          }
        }
        throw error;
      }
    );
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  private getCachedData<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  async getLiveMatches(): Promise<ApiResponse<Match[]>> {
    const cacheKey = 'live-matches';
    const cached = this.getCachedData<ApiResponse<Match[]>>(cacheKey);
    
    if (cached) return cached;

    await this.enforceRateLimit();
    
    try {
      const response = await this.api.get('/fixtures', {
        params: { live: 'all' }
      });
      
      const data: ApiResponse<Match[]> = {
        data: response.data.response,
        status: response.status
      };
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTeamStats(teamId: number): Promise<ApiResponse<TeamStats>> {
    const cacheKey = `team-stats-${teamId}`;
    const cached = this.getCachedData<ApiResponse<TeamStats>>(cacheKey);
    
    if (cached) return cached;

    await this.enforceRateLimit();
    
    try {
      const response = await this.api.get(`/teams/statistics`, {
        params: { team: teamId }
      });
      
      const data: ApiResponse<TeamStats> = {
        data: response.data.response,
        status: response.status
      };
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLeagueStandings(leagueId: number): Promise<ApiResponse<LeagueStanding[]>> {
    const cacheKey = `standings-${leagueId}`;
    const cached = this.getCachedData<ApiResponse<LeagueStanding[]>>(cacheKey);
    
    if (cached) return cached;

    await this.enforceRateLimit();
    
    try {
      const response = await this.api.get('/standings', {
        params: { league: leagueId }
      });
      
      const data: ApiResponse<LeagueStanding[]> = {
        data: response.data.response[0].league.standings[0],
        status: response.status
      };
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchPlayers(query: string): Promise<ApiResponse<Player[]>> {
    await this.enforceRateLimit();
    
    try {
      const response = await this.api.get('/players/search', {
        params: { search: query }
      });
      
      return {
        data: response.data.response,
        status: response.status
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFixtureDetails(fixtureId: number): Promise<ApiResponse<Match>> {
    const cacheKey = `fixture-${fixtureId}`;
    const cached = this.getCachedData<ApiResponse<Match>>(cacheKey);
    
    if (cached) return cached;

    await this.enforceRateLimit();
    
    try {
      const response = await this.api.get(`/fixtures`, {
        params: { id: fixtureId }
      });
      
      const data: ApiResponse<Match> = {
        data: response.data.response[0],
        status: response.status
      };
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      return new Error(
        `API Error (${status}): ${data.message || 'Unknown error occurred'}`
      );
    }
    return new Error('Network error occurred');
  }
}

export const footballApi = new FootballApiService();