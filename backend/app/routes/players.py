from flask import Blueprint, jsonify, request
from app.models.player import Player
from app.schemas.player_schema import PlayerSchema
from app.services.db import db
from flasgger import swag_from

player_bp = Blueprint('player_bp', __name__)
player_schema = PlayerSchema()
players_schema = PlayerSchema(many=True)

@player_bp.route('/api/players', methods=['GET'])
@swag_from({
    'tags': ['Players'],
    'parameters': [
        {
            'name': 'name',
            'in': 'query',
            'type': 'string',
            'description': 'Filter by player name'
        },
        {
            'name': 'nationality',
            'in': 'query',
            'type': 'string',
            'description': 'Filter by nationality'
        },
        {
            'name': 'position',
            'in': 'query',
            'type': 'string',
            'description': 'Filter by position'
        },
        {
            'name': 'team_name',
            'in': 'query',
            'type': 'string',
            'description': 'Filter by team name'
        },
        {
            'name': 'area',
            'in': 'query',
            'type': 'string',
            'description': 'Filter by team area'
        }
    ],
    'responses': {
        200: {
            'description': 'List of filtered players'
        }
    }
})
def get_players():
    try:
        # Get filter parameters
        filters = {
            'name': request.args.get('name'),
            'nationality': request.args.get('nationality'),
            'position': request.args.get('position'),
            'team_name': request.args.get('team_name'),
            'area': request.args.get('area')
        }

        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}

        # Debug log
        print(f"Applying filters: {filters}")

        players = Player.get_filtered_players(filters)
        result = players_schema.dump(players)

        return jsonify({
            'success': True,
            'data': result,
            'count': len(result)
        })
    except Exception as e:
        print(f"Error in get_players: {str(e)}")  # Debug log
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@player_bp.route('/api/players/<int:id>', methods=['GET'])
@swag_from({
    'tags': ['Players'],
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The player ID'
        }
    ],
    'responses': {
        200: {
            'description': 'Player data',
            'examples': {
                'application/json': {
                    'id': 1,
                    'name': 'Bukayo Saka',
                    'position': 'Winger',
                    'nationality': 'England',
                    'team_id': 1
                }
            }
        },
        404: {
            'description': 'Player not found'
        }
    }
})
def get_player(id):
    player = Player.query.get_or_404(id)
    return jsonify(player_schema.dump(player))
