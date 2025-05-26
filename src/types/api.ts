export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string;
  continent: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  area_id: number;
  area?: Area;
}

export interface Team {
  id: number;
  name: string;
  short_name: string;
  tla: string;
  logo: string;
  founded: number;
  club_colors: string;
  venue: string;
  website: string;
  area_id: number;
  area?: Area;
  squad?: Player[];
  competitions?: Competition[];
}

export interface Player {
  id: number;
  name: string;
  position: string;
  date_of_birth: string;
  nationality: string;
  shirt_number: number;
  team_id: number;
  team?: Team;
}

export interface Match {
  id: number;
  date: string;
  status: string;
  matchday: number;
  stage: string;
  group: string;
  venue: string;
  home_team_id: number;
  away_team_id: number;
  competition_id: number;
  home_score: number | null;
  away_score: number | null;
  home_team?: Team;
  away_team?: Team;
  competition?: Competition;
}