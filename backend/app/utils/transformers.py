from typing import Dict, List
from datetime import datetime

def transform_team_data(api_team: Dict) -> Dict:
    """Transform Football-Data.org team to our format"""
    return {
        'id': api_team.get('id'),
        'name': api_team.get('name', ''),
        'area': api_team.get('area', {}).get('name', ''),
        'founded': api_team.get('founded'),
        'venue': api_team.get('venue', ''),
        'website': api_team.get('website', ''),
        'crest': api_team.get('crest', ''),
        'club_colors': api_team.get('clubColors', ''),
        'coach': api_team.get('coach', {}).get('name', '') if api_team.get('coach') else ''
    }

def transform_match_data(api_match: Dict) -> Dict:
    """Transform Football-Data.org match to our format"""
    return {
        'id': api_match.get('id'),
        'competition': api_match.get('competition', {}).get('name', ''),
        'season': api_match.get('season', {}).get('startDate', ''),
        'match_date': api_match.get('utcDate', ''),
        'status': api_match.get('status', ''),
        'home_team': {
            'id': api_match.get('homeTeam', {}).get('id'),
            'name': api_match.get('homeTeam', {}).get('name', ''),
            'crest': api_match.get('homeTeam', {}).get('crest', '')
        },
        'away_team': {
            'id': api_match.get('awayTeam', {}).get('id'),
            'name': api_match.get('awayTeam', {}).get('name', ''),
            'crest': api_match.get('awayTeam', {}).get('crest', '')
        },
        'score': {
            'home': api_match.get('score', {}).get('fullTime', {}).get('home'),
            'away': api_match.get('score', {}).get('fullTime', {}).get('away')
        }
    }

def transform_competition_data(api_competition: Dict) -> Dict:
    """Transform Football-Data.org competition to our format"""
    return {
        'id': api_competition.get('id'),
        'name': api_competition.get('name', ''),
        'code': api_competition.get('code', ''),
        'area': api_competition.get('area', {}).get('name', ''),
        'plan': api_competition.get('plan', ''),
        'current_season': api_competition.get('currentSeason', {})
    }