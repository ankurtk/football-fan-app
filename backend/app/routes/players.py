from flask import Blueprint, request, jsonify
from app.services.service import FootballDataAPI
from app.services.rapidapi_service import RapidAPIFootballService
from app.utils.rapidapi_transformers import transform_rapidapi_player
import logging

player_bp = Blueprint('players', __name__)
football_api = FootballDataAPI()
rapidapi_service = RapidAPIFootballService()
logger = logging.getLogger(__name__)

@player_bp.route('/api/teams/<int:team_id>/players', methods=['GET'])
def get_players_by_team(team_id):
    """Get detailed players for a specific team using RapidAPI"""
    try:
        season = request.args.get('season', 2024, type=int)

        logger.info(f"Fetching players for RapidAPI team ID: {team_id}, season: {season}")

        # Direct call to RapidAPI - no more team ID mapping needed
        api_players = rapidapi_service.get_players_by_team(team_id, season)

        # If no players found for 2024, try 2023
        if not api_players and season == 2024:
            logger.info("No players found for 2024, trying 2023")
            api_players = rapidapi_service.get_players_by_team(team_id, 2023)
            season = 2024

        # Transform data to our format
        players = [transform_rapidapi_player(player) for player in api_players]

        return jsonify({
            'success': True,
            'data': players,
            'count': len(players),
            'team_id': team_id,
            'season_used': season,
            'data_source': 'rapidapi'
        })

    except Exception as e:
        logger.error(f"Error fetching players for team {team_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch players data',
            'details': str(e)
        }), 500

@player_bp.route('/api/players/<int:player_id>', methods=['GET'])
def get_player_by_id(player_id):
    """Get detailed player information by ID"""
    try:
        season = request.args.get('season', 2024, type=int)

        logger.info(f"Fetching player {player_id} for season {season}")

        # Try to get player from RapidAPI
        api_player = rapidapi_service.get_player_by_id(player_id, season)

        if not api_player:
            logger.warning(f"Player {player_id} not found in RapidAPI")
            return jsonify({
                'success': False,
                'error': f'Player {player_id} not found. This player might not be available in our database.',
                'suggestion': 'Try searching by player name instead.'
            }), 404

        # Transform data to our format
        player = transform_rapidapi_player(api_player)

        return jsonify({
            'success': True,
            'data': player
        })

    except Exception as e:
        logger.error(f"Error fetching player {player_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch player data',
            'details': str(e)
        }), 500

@player_bp.route('/api/players/search', methods=['GET'])
def search_players():
    """Search players by name"""
    try:
        name = request.args.get('name', '')
        season = request.args.get('season', 2024, type=int)

        if not name:
            return jsonify({
                'success': False,
                'error': 'Name parameter is required'
            }), 400

        # Search players using RapidAPI
        api_players = rapidapi_service.search_players(name, season)

        # Transform data to our format
        players = [transform_rapidapi_player(player) for player in api_players]

        return jsonify({
            'success': True,
            'data': players,
            'count': len(players)
        })

    except Exception as e:
        logger.error(f"Error searching players with name '{name}': {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to search players'
        }), 500

@player_bp.route('/api/teams/<int:team_id>/statistics', methods=['GET'])
def get_team_statistics(team_id):
    """Get team statistics"""
    try:
        league_id = request.args.get('league', 39, type=int)  # Default to Premier League
        season = request.args.get('season', 2024, type=int)

        # Direct call to RapidAPI - no mapping needed
        stats = rapidapi_service.get_team_statistics(team_id, league_id, season)

        if not stats:
            return jsonify({
                'success': False,
                'error': 'Team statistics not found'
            }), 404

        return jsonify({
            'success': True,
            'data': stats
        })

    except Exception as e:
        logger.error(f"Error fetching team statistics for {team_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch team statistics'
        }), 500

@player_bp.route('/api/players/debug/<int:player_id>', methods=['GET'])
def debug_player_call(player_id):
    """Debug what RapidAPI returns for a specific player"""
    try:
        season = request.args.get('season', 2024, type=int)

        logger.info(f"Debug: Fetching player {player_id} for season {season}")

        # Make direct API call and return raw response
        raw_data = rapidapi_service._make_request("/players", {
            "id": player_id,
            "season": season
        })

        logger.info(f"Debug: Raw response for player {player_id}: {raw_data}")

        return jsonify({
            'success': True,
            'player_id': player_id,
            'season': season,
            'raw_response': raw_data,
            'response_count': len(raw_data.get("response", [])) if raw_data else 0,
            'first_player': raw_data.get("response", [{}])[0] if raw_data and raw_data.get("response") else None
        })

    except Exception as e:
        logger.error(f"Debug error for player {player_id}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
