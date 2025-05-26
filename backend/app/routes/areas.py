from flask import Blueprint, jsonify, request
from app.models.area import Area
from app.schemas.area_schema import AreaSchema
from app.services.db import db

area_bp = Blueprint('area_bp', __name__)
area_schema = AreaSchema()
areas_schema = AreaSchema(many=True)

@area_bp.route('/api/areas', methods=['GET'])
def get_areas():
    try:
        # Get filter parameters with debug logging
        search = request.args.get('search')
        country_code = request.args.get('country_code')
        print(f"Search term: {search}, Country code: {country_code}")  # Debug log

        filters = {
            'search': search,
            'country_code': country_code
        }

        areas = Area.get_filtered_areas(filters)
        result = areas_schema.dump(areas)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        print(f"Error in get_areas: {str(e)}")  # Debug log
        return jsonify({'success': False, 'error': str(e)}), 500

@area_bp.route('/api/areas/search', methods=['GET'])
def search_areas():
    try:
        search_term = request.args.get('q', '')
        print(f"Search term received: {search_term}")  # Debug log

        areas = Area.search_areas(search_term)
        result = areas_schema.dump(areas)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        print(f"Error in search_areas: {str(e)}")  # Debug log
        return jsonify({'success': False, 'error': str(e)}), 500

@area_bp.route('/api/areas/<int:id>', methods=['GET'])
def get_area(id):
    area = Area.query.get_or_404(id)
    return jsonify(area_schema.dump(area))
