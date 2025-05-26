from flask import Blueprint, request, jsonify
from app.models.team import Team
from app.schemas.team_schema import TeamSchema
from app.services.db import db
from flasgger import swag_from


team_bp = Blueprint('team_bp', __name__)
team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)

@team_bp.route('/api/teams', methods=['GET'])
@swag_from({
    'tags': ['Teams'],
    'responses': {
        200: {
            'description': 'List all teams',
            'examples': {
                'application/json': [
                    {'id': 1, 'name': 'Arsenal'},
                    {'id': 2, 'name': 'Real Madrid'}
                ]
            }
        }
    }
})
def get_teams():
    try:
        search_term = request.args.get('name', '')
        teams = Team.search_by_name(search_term)
        result = teams_schema.dump(teams)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        print(f"Error in get_teams: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@team_bp.route('/api/teams/<int:id>', methods=['GET'])
def get_team(id):
    team = Team.query.get_or_404(id)
    return jsonify(team_schema.dump(team))

@team_bp.route('/api/teams', methods=['POST'])
def create_team():
    data = request.json
    new_team = team_schema.load(data)
    db.session.add(new_team)
    db.session.commit()
    return jsonify(team_schema.dump(new_team)), 201

@team_bp.route('/api/teams/<int:id>', methods=['PUT'])
def update_team(id):
    team = Team.query.get_or_404(id)
    updated_data = team_schema.load(request.json, instance=team, partial=True)
    db.session.commit()
    return jsonify(team_schema.dump(updated_data))

@team_bp.route('/api/teams/<int:id>', methods=['DELETE'])
def delete_team(id):
    team = Team.query.get_or_404(id)
    db.session.delete(team)
    db.session.commit()
    return jsonify({"message": "Team deleted"})
