from typing import Dict, List

def transform_rapidapi_player(api_player: Dict) -> Dict:
    """Transform RapidAPI player data to our format"""
    player = api_player.get("player", {})
    statistics = api_player.get("statistics", [{}])[0] if api_player.get("statistics") else {}

    # Handle birth data
    birth = player.get("birth", {})

    # Handle statistics data
    games = statistics.get("games", {})
    goals = statistics.get("goals", {})
    cards = statistics.get("cards", {})
    team = statistics.get("team", {})
    league = statistics.get("league", {})

    return {
        'id': player.get('id', 0),
        'name': player.get('name', 'Unknown'),
        'firstname': player.get('firstname', ''),
        'lastname': player.get('lastname', ''),
        'age': player.get('age', 0),
        'nationality': player.get('nationality', 'Unknown'),
        'height': player.get('height', 'N/A'),
        'weight': player.get('weight', 'N/A'),
        'photo': player.get('photo', ''),
        'injured': player.get('injured', False),
        'birth': {
            'date': birth.get('date', ''),
            'place': birth.get('place', 'Unknown'),
            'country': birth.get('country', 'Unknown')
        },
        'statistics': {
            'position': games.get('position', 'N/A'),
            'appearances': games.get('appearences', 0),  # Note: API uses 'appearences' (typo)
            'lineups': games.get('lineups', 0),
            'minutes': games.get('minutes', 0),
            'rating': games.get('rating', '0'),
            'captain': games.get('captain', False),
            'goals': {
                'total': goals.get('total', 0),
                'assists': goals.get('assists', 0),
                'saves': goals.get('saves', 0),
                'conceded': goals.get('conceded', 0)
            },
            'cards': {
                'yellow': cards.get('yellow', 0),
                'red': cards.get('red', 0)
            }
        },
        'current_team': {
            'id': team.get('id', 0),
            'name': team.get('name', 'Unknown'),
            'logo': team.get('logo', '')
        },
        'current_league': {
            'id': league.get('id', 0),
            'name': league.get('name', 'Unknown'),
            'country': league.get('country', 'Unknown'),
            'logo': league.get('logo', ''),
            'flag': league.get('flag', '')
        }
    }

def transform_rapidapi_team_stats(api_stats: Dict) -> Dict:
    """Transform RapidAPI team statistics"""
    return {
        'team': api_stats.get('team', {}),
        'league': api_stats.get('league', {}),
        'form': api_stats.get('form', ''),
        'fixtures': api_stats.get('fixtures', {}),
        'goals': api_stats.get('goals', {}),
        'biggest': api_stats.get('biggest', {}),
        'clean_sheet': api_stats.get('clean_sheet', {}),
        'failed_to_score': api_stats.get('failed_to_score', {}),
        'penalty': api_stats.get('penalty', {}),
        'lineups': api_stats.get('lineups', []),
        'cards': api_stats.get('cards', {})
    }

def transform_rapidapi_team(api_team: Dict) -> Dict:
    """Transform RapidAPI team data to our format"""
    team = api_team.get("team", {})
    venue = api_team.get("venue", {})

    return {
        'id': team.get('id'),
        'name': team.get('name', ''),
        'code': team.get('code', ''),
        'country': team.get('country', ''),
        'founded': team.get('founded'),
        'national': team.get('national', False),
        'logo': team.get('logo', ''),
        'crest': team.get('logo', ''),  # Alias for compatibility
        'venue': venue.get('name', ''),
        'venue_details': {
            'id': venue.get('id'),
            'name': venue.get('name', ''),
            'address': venue.get('address', ''),
            'city': venue.get('city', ''),
            'capacity': venue.get('capacity'),
            'surface': venue.get('surface', ''),
            'image': venue.get('image', '')
        }
    }

def transform_rapidapi_fixture(api_fixture: Dict) -> Dict:
    """Transform RapidAPI fixture data to our format"""
    fixture = api_fixture.get("fixture", {})
    league = api_fixture.get("league", {})
    teams = api_fixture.get("teams", {})
    goals = api_fixture.get("goals", {})
    score = api_fixture.get("score", {})

    return {
        'id': fixture.get('id'),
        'competition': league.get('name', ''),
        'competition_id': league.get('id'),
        'match_date': fixture.get('date', ''),
        'status': fixture.get('status', {}).get('long', ''),
        'status_short': fixture.get('status', {}).get('short', ''),
        'venue': fixture.get('venue', {}).get('name', ''),
        'referee': fixture.get('referee', ''),
        'home_team': {
            'id': teams.get('home', {}).get('id'),
            'name': teams.get('home', {}).get('name', ''),
            'logo': teams.get('home', {}).get('logo', ''),
            'crest': teams.get('home', {}).get('logo', '')  # Alias
        },
        'away_team': {
            'id': teams.get('away', {}).get('id'),
            'name': teams.get('away', {}).get('name', ''),
            'logo': teams.get('away', {}).get('logo', ''),
            'crest': teams.get('away', {}).get('logo', '')  # Alias
        },
        'score': {
            'home': goals.get('home'),
            'away': goals.get('away')
        },
        'score_details': {
            'halftime': {
                'home': score.get('halftime', {}).get('home'),
                'away': score.get('halftime', {}).get('away')
            },
            'fulltime': {
                'home': score.get('fulltime', {}).get('home'),
                'away': score.get('fulltime', {}).get('away')
            },
            'extratime': {
                'home': score.get('extratime', {}).get('home'),
                'away': score.get('extratime', {}).get('away')
            },
            'penalty': {
                'home': score.get('penalty', {}).get('home'),
                'away': score.get('penalty', {}).get('away')
            }
        }
    }