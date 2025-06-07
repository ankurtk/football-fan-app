import requests
import os
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class RapidAPIFootballService:
    def __init__(self):
        self.base_url = "https://api-football-v1.p.rapidapi.com/v3"
        self.headers = {
            "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
            "X-RapidAPI-Host": os.getenv("RAPIDAPI_HOST", "api-football-v1.p.rapidapi.com")
        }

    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Make API request with error handling"""
        try:
            response = requests.get(
                f"{self.base_url}{endpoint}",
                headers=self.headers,
                params=params or {},
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"RapidAPI request failed: {e}")
            return None

    def get_players_by_team(self, team_id: int, season: int = 2024) -> List[Dict]:
        """Get players by team ID for a specific season"""
        data = self._make_request("/players", {
            "team": team_id,
            "season": season
        })
        return data.get("response", []) if data else []

    def get_fixtures(self, league_id: int = 39, season: int = 2024, status: str = "NS") -> List[Dict]:
        """Get fixtures from RapidAPI using season and status"""
        logger.info(f"Getting fixtures for league {league_id}, season {season}, status {status}")

        # Use season-based approach as per RapidAPI documentation
        params = {
            "league": league_id,
            "season": season
        }

        # Add status filter if specified
        if status and status != "all":
            params["status"] = status

        data = self._make_request("/fixtures", params)
        fixtures = data.get("response", []) if data else []
        logger.info(f"Retrieved {len(fixtures)} fixtures for league {league_id}, season {season}")
        return fixtures

    def get_fixtures_by_date(self, date: str, league_id: int = None) -> List[Dict]:
        """Get fixtures for a specific date (YYYY-MM-DD format)"""
        logger.info(f"Fetching fixtures for date {date}, league {league_id}")

        params = {"date": date}
        if league_id:
            params["league"] = league_id

        data = self._make_request("/fixtures", params)
        fixtures = data.get("response", []) if data else []
        logger.info(f"Retrieved {len(fixtures)} fixtures for date {date}")
        return fixtures

    def get_fixtures_by_date_range(self, from_date: str, to_date: str, league_id: int = None) -> List[Dict]:
        """Get fixtures between two dates (YYYY-MM-DD format)"""
        logger.info(f"Fetching fixtures from {from_date} to {to_date}, league {league_id}")

        params = {
            "from": from_date,
            "to": to_date
        }
        if league_id:
            params["league"] = league_id

        data = self._make_request("/fixtures", params)
        fixtures = data.get("response", []) if data else []
        logger.info(f"Retrieved {len(fixtures)} fixtures for date range")
        return fixtures

    def get_live_fixtures(self, league_id: int = None) -> List[Dict]:
        """Get currently live fixtures"""
        logger.info(f"Fetching live fixtures for league {league_id}")

        params = {"live": "all"}
        if league_id:
            params["league"] = league_id

        data = self._make_request("/fixtures", params)
        fixtures = data.get("response", []) if data else []
        logger.info(f"Retrieved {len(fixtures)} live fixtures")
        return fixtures

    def get_upcoming_fixtures(self, league_id: int = None, days: int = 14) -> List[Dict]:
        """Get upcoming fixtures for next X days"""
        from datetime import datetime, timedelta

        today = datetime.now().strftime('%Y-%m-%d')
        future_date = (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')

        logger.info(f"Fetching upcoming fixtures from {today} to {future_date}")

        return self.get_fixtures_by_date_range(today, future_date, league_id)

    def get_recent_fixtures(self, league_id: int = None, days: int = 14) -> List[Dict]:
        """Get recent fixtures from last X days"""
        from datetime import datetime, timedelta

        past_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        today = datetime.now().strftime('%Y-%m-%d')

        logger.info(f"Fetching recent fixtures from {past_date} to {today}")

        return self.get_fixtures_by_date_range(past_date, today, league_id)

    def get_players_by_team_detailed(self, team_id: int, season: int = 2024) -> List[Dict]:
        """Get players with detailed stats by team ID (alias for existing method)"""
        return self.get_players_by_team(team_id, season)

    def get_player_by_id(self, player_id: int, season: int = 2024) -> Optional[Dict]:
        """Get single player details by ID"""
        logger.info(f"Getting player {player_id} for season {season}")

        # Try with season parameter first
        data = self._make_request("/players", {
            "id": player_id,
            "season": season
        })

        if data and data.get("response"):
            response = data.get("response", [])
            if response:
                logger.info(f"Found player: {response[0].get('player', {}).get('name', 'Unknown')}")
                return response[0]

        # If not found with season, try without season parameter
        logger.info(f"Trying player {player_id} without season parameter")
        data = self._make_request("/players", {
            "id": player_id
        })

        if data and data.get("response"):
            response = data.get("response", [])
            if response:
                logger.info(f"Found player without season: {response[0].get('player', {}).get('name', 'Unknown')}")
                return response[0]

        logger.warning(f"No player found with ID {player_id}")
        return None

    def search_players(self, name: str, season: int = 2024) -> List[Dict]:
        """Search players by name"""
        logger.info(f"Searching for players with name: {name}")

        data = self._make_request("/players", {
            "search": name,
            "season": season
        })

        if data and data.get("response"):
            players = data.get("response", [])
            logger.info(f"Found {len(players)} players matching '{name}'")
            return players

        logger.warning(f"No players found matching '{name}'")
        return []

    def get_team_statistics(self, team_id: int, league_id: int, season: int = 2024) -> Optional[Dict]:
        """Get team statistics for a league/season"""
        data = self._make_request("/teams/statistics", {
            "team": team_id,
            "league": league_id,
            "season": season
        })
        return data.get("response", {}) if data else None

    def get_teams_by_league(self, league_id: int, season: int = 2024) -> List[Dict]:
        """Get teams by league ID for a specific season"""
        data = self._make_request("/teams", {
            "league": league_id,
            "season": season
        })
        return data.get("response", []) if data else []

    def get_team_by_id(self, team_id: int, season: int = 2024) -> Optional[Dict]:
        """Get single team details by ID"""
        logger.info(f"Getting team {team_id} for season {season}")

        data = self._make_request("/teams", {
            "id": team_id,
            "season": season
        })

        if data:
            response = data.get("response", [])
            logger.info(f"RapidAPI returned {len(response)} teams for ID {team_id}")

            if response:
                logger.info(f"Found team: {response[0].get('team', {}).get('name', 'Unknown')}")
                return response[0]
            else:
                logger.warning(f"No team found with ID {team_id} for season {season}")
                return None
        else:
            logger.error(f"No data returned from RapidAPI for team {team_id}")
            return None

    def search_teams(self, name: str) -> List[Dict]:
        """Search teams by name"""
        data = self._make_request("/teams", {
            "search": name
        })
        return data.get("response", []) if data else []

    def get_leagues(self) -> List[Dict]:
        """Get available leagues"""
        data = self._make_request("/leagues")
        return data.get("response", []) if data else []

    def get_team_by_id_from_league(self, team_id: int, season: int = 2024) -> Optional[Dict]:
        """Get team by ID by searching through league teams (fallback method)"""
        # Try major leagues where this team might be
        major_leagues = [140, 39, 135, 78, 61]  # La Liga, Premier League, Serie A, Bundesliga, Ligue 1

        for league_id in major_leagues:
            logger.info(f"Searching for team {team_id} in league {league_id}")
            teams = self.get_teams_by_league(league_id, season)

            for team_data in teams:
                team = team_data.get("team", {})
                if team.get("id") == team_id:
                    logger.info(f"Found team {team_id} in league {league_id}")
                    return team_data

        logger.warning(f"Team {team_id} not found in any major league for season {season}")
        return None

    def get_recent_and_upcoming_matches(self, league_id: int = 39, days_back: int = 7, days_forward: int = 14) -> Dict:
        """Get recent and upcoming matches using date range"""
        from datetime import datetime, timedelta

        now = datetime.now()
        from_date = (now - timedelta(days=days_back)).strftime('%Y-%m-%d')
        to_date = (now + timedelta(days=days_forward)).strftime('%Y-%m-%d')

        logger.info(f"Getting recent and upcoming matches from {from_date} to {to_date}")

        fixtures = self.get_fixtures_by_date_range(from_date, to_date, league_id)

        recent = []
        upcoming = []

        for fixture in fixtures:
            try:
                match_date = datetime.fromisoformat(fixture.get("fixture", {}).get("date", "").replace("Z", "+00:00"))
                if match_date < now:
                    recent.append(fixture)
                else:
                    upcoming.append(fixture)
            except Exception as e:
                logger.warning(f"Error parsing date for fixture: {e}")
                continue

        logger.info(f"Found {len(recent)} recent and {len(upcoming)} upcoming matches")

        return {
            "recent": recent,
            "upcoming": upcoming,
            "all": fixtures
        }

    def get_fixtures_by_season_and_status(self, league_id: int, season: int = 2024, status: str = None) -> List[Dict]:
        """Get fixtures by league, season and optional status"""
        logger.info(f"Fetching fixtures for league {league_id}, season {season}, status {status}")

        params = {
            "league": league_id,
            "season": season
        }

        if status:
            params["status"] = status

        data = self._make_request("/fixtures", params)
        fixtures = data.get("response", []) if data else []
        logger.info(f"Retrieved {len(fixtures)} fixtures")
        return fixtures

    def get_current_season_fixtures(self, league_id: int = 39) -> List[Dict]:
        """Get all fixtures for current season (2024-2025)"""
        # For most European leagues, 2024 season covers 2024-2025
        return self.get_fixtures_by_season_and_status(league_id, 2024)

    def get_upcoming_fixtures_by_season(self, league_id: int = 39, season: int = 2024) -> List[Dict]:
        """Get upcoming fixtures by season"""
        return self.get_fixtures_by_season_and_status(league_id, season, "NS")

    def get_finished_fixtures_by_season(self, league_id: int = 39, season: int = 2024) -> List[Dict]:
        """Get finished fixtures by season"""
        return self.get_fixtures_by_season_and_status(league_id, season, "FT")

    def get_live_fixtures_by_season(self, league_id: int = 39, season: int = 2024) -> List[Dict]:
        """Get live fixtures by season"""
        return self.get_fixtures_by_season_and_status(league_id, season, "LIVE")

    def get_today_fixtures(self, league_id: int = None) -> List[Dict]:
        """Get today's fixtures"""
        from datetime import datetime

        today = datetime.now().strftime('%Y-%m-%d')
        return self.get_fixtures_by_date(today, league_id)