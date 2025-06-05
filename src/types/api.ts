export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface TeamStats {
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

export interface Player {
  id: number;
  name: string;
  age: number;
  nationality: string;
  position: string;
}

export interface Match {
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

export interface LeagueStanding {
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