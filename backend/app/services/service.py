import requests
import os
from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class FootballDataAPI:
    def __init__(self):
        self.base_url = "https://api.football-data.org/v4"
        self.api_key = os.getenv("FOOTBALL_DATA_API_KEY")
        self.headers = {
            "X-Auth-Token": self.api_key
        }

    def _make_request(self, endpoint: str) -> Optional[Dict]:
        """Make API request with error handling"""
        try:
            response = requests.get(
                f"{self.base_url}{endpoint}",
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {e}")
            return None

    def get_competitions(self) -> List[Dict]:
        """Get available competitions"""
        data = self._make_request("/competitions")
        return data.get("competitions", []) if data else []

    def get_teams(self, competition_code: str = "PL") -> List[Dict]:
        """Get teams from a specific competition (default: Premier League)"""
        data = self._make_request(f"/competitions/{competition_code}/teams")
        return data.get("teams", []) if data else []

    def get_team_by_id(self, team_id: int) -> Optional[Dict]:
        """Get single team by ID with squad information"""
        data = self._make_request(f"/teams/{team_id}")
        return data if data else None

    def get_matches(self, competition_code: str = "PL") -> List[Dict]:
        """Get matches for competition"""
        data = self._make_request(f"/competitions/{competition_code}/matches")
        return data.get("matches", []) if data else []

    def get_standings(self, competition_code: str = "PL") -> List[Dict]:
        """Get league standings"""
        data = self._make_request(f"/competitions/{competition_code}/standings")
        return data.get("standings", []) if data else []