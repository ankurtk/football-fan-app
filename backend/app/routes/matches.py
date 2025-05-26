from flask import Blueprint, request, jsonify
from app.models.match import Match
from app.schemas.match_schema import MatchSchema
from app.services.db import db

match_bp = Blueprint('match_bp', __name__)
match_schema = MatchSchema()
matches_schema = MatchSchema(many=True)

@match_bp.route('/api/matches', methods=['GET'])
def get_matches():
    try:
        team_name = request.args.get('team_name', '')
        print(f"Searching matches for team: {team_name}")  # Debug log

        matches = Match.search_by_team_name(team_name)
        result = matches_schema.dump(matches)
        return jsonify({
            'success': True,
            'data': result,
            'count': len(result)
        })
    except Exception as e:
        print(f"Error in get_matches: {str(e)}")  # Debug log
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@match_bp.route('/api/matches/<int:id>', methods=['GET'])
def get_match(id):
    try:
        match = Match.query.get_or_404(id)
        return jsonify({
            'success': True,
            'data': match_schema.dump(match)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
