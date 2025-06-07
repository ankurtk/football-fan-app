from flask import Blueprint, request, jsonify
from app.services.service import FootballDataAPI
from app.services.rapidapi_service import RapidAPIFootballService
from app.utils.transformers import transform_team_data, transform_competition_data
from app.utils.rapidapi_transformers import transform_rapidapi_team
import logging

team_bp = Blueprint('teams', __name__)
football_api = FootballDataAPI()
rapidapi_service = RapidAPIFootballService()
logger = logging.getLogger(__name__)

@team_bp.route('/api/teams', methods=['GET'])
def get_teams():
    """Get teams from external API"""
    try:
        use_rapidapi = request.args.get('use_rapidapi', 'false').lower() == 'true'

        if use_rapidapi:
            league_id = request.args.get('league', 39, type=int)  # Default to Premier League
            season = request.args.get('season', 2024, type=int)

            # Get teams from RapidAPI
            api_teams = rapidapi_service.get_teams_by_league(league_id, season)
            teams = [transform_rapidapi_team(team) for team in api_teams]

            return jsonify({
                'success': True,
                'data': teams,
                'count': len(teams),
                'source': 'rapidapi',
                'league_id': league_id,
                'season': season
            })
        else:
            # Use existing Football-Data.org API
            competition = request.args.get('competition', 'PL')
            api_teams = football_api.get_teams(competition)
            teams = [transform_team_data(team) for team in api_teams]

            return jsonify({
                'success': True,
                'data': teams,
                'count': len(teams),
                'source': 'football_data',
                'competition': competition
            })

    except Exception as e:
        logger.error(f"Error fetching teams: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch teams data'
        }), 500

@team_bp.route('/api/teams/<int:team_id>', methods=['GET'])
def get_team_by_id(team_id):
    """Get single team by ID with full details"""
    try:
        use_rapidapi = request.args.get('use_rapidapi', 'false').lower() == 'true'

        if use_rapidapi:
            season = request.args.get('season', 2024, type=int)

            logger.info(f"Fetching team {team_id} from RapidAPI, season {season}")

            # Try direct team lookup first
            api_team = rapidapi_service.get_team_by_id(team_id, season)

            # If direct lookup fails, try finding team in league data
            if not api_team:
                logger.info(f"Direct lookup failed, trying league search for team {team_id}")
                api_team = rapidapi_service.get_team_by_id_from_league(team_id, season)

            if not api_team:
                logger.warning(f"Team {team_id} not found in RapidAPI")
                return jsonify({
                    'success': False,
                    'error': f'Team {team_id} not found'
                }), 404

            # Transform team data
            transformed_team = transform_rapidapi_team(api_team)

            return jsonify({
                'success': True,
                'data': transformed_team,
                'source': 'rapidapi',
                'season_used': season
            })
        else:
            # Use existing Football-Data.org API
            competition = request.args.get('competition', 'PL')
            team_data = football_api.get_team_by_id(team_id)

            if not team_data:
                # Fallback: search through competition teams
                api_teams = football_api.get_teams(competition)
                team_data = next((team for team in api_teams if team.get('id') == team_id), None)

            if not team_data:
                return jsonify({
                    'success': False,
                    'error': 'Team not found'
                }), 404

            # Transform team data
            transformed_team = transform_team_data(team_data)

            # Add squad information if available
            squad = team_data.get('squad', [])
            players = []

            for player in squad:
                players.append({
                    'id': player.get('id', 0),
                    'name': player.get('name', 'Unknown'),
                    'position': player.get('position', 'N/A'),
                    'dateOfBirth': player.get('dateOfBirth', ''),
                    'nationality': player.get('nationality', 'Unknown'),
                    'shirtNumber': player.get('shirtNumber'),
                    'role': player.get('role', '')
                })

            # Add squad info to team data
            transformed_team['squad'] = players
            transformed_team['squad_count'] = len(players)

            return jsonify({
                'success': True,
                'data': transformed_team,
                'source': 'football_data'
            })

    except Exception as e:
        logger.error(f"Error fetching team {team_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch team data',
            'details': str(e)
        }), 500

@team_bp.route('/api/competitions', methods=['GET'])
def get_competitions():
    """Get available competitions"""
    try:
        use_rapidapi = request.args.get('use_rapidapi', 'false').lower() == 'true'

        if use_rapidapi:
            # Get leagues from RapidAPI
            api_leagues = rapidapi_service.get_leagues()
            competitions = []

            # Filter for major leagues only
            major_leagues = [39, 140, 135, 78, 61, 2, 3]  # PL, La Liga, Serie A, Bundesliga, Ligue 1, UCL, Nations League

            for league_data in api_leagues:
                league = league_data.get('league', {})
                if league.get('id') in major_leagues:
                    competitions.append({
                        'id': league.get('id'),
                        'name': league.get('name', ''),
                        'type': league.get('type', ''),
                        'logo': league.get('logo', ''),
                        'country': league_data.get('country', {}).get('name', ''),
                        'seasons': league_data.get('seasons', [])
                    })

            return jsonify({
                'success': True,
                'data': competitions,
                'count': len(competitions),
                'source': 'rapidapi'
            })
        else:
            # Use existing Football-Data.org API
            api_competitions = football_api.get_competitions()
            competitions = [transform_competition_data(comp) for comp in api_competitions]

            return jsonify({
                'success': True,
                'data': competitions,
                'count': len(competitions),
                'source': 'football_data'
            })

    except Exception as e:
        logger.error(f"Error fetching competitions: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch competitions data'
        }), 500