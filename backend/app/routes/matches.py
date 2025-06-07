from flask import Blueprint, request, jsonify
from app.services.rapidapi_service import RapidAPIFootballService
from app.utils.rapidapi_transformers import transform_rapidapi_fixture
import logging
from datetime import datetime, timedelta

match_bp = Blueprint('matches', __name__)
rapidapi_service = RapidAPIFootballService()
logger = logging.getLogger(__name__)

@match_bp.route('/api/matches', methods=['GET'])
def get_matches():
    """Get matches from RapidAPI using season-based approach"""
    try:
        league_id = request.args.get('league', 39, type=int)
        season = request.args.get('season', 2024, type=int)  # Add season parameter
        match_type = request.args.get('type', 'all')
        team_name = request.args.get('team_name', '').lower()

        logger.info(f"Fetching matches: league={league_id}, season={season}, type={match_type}")

        api_matches = []

        if match_type == 'upcoming':
            api_matches = rapidapi_service.get_upcoming_fixtures_by_season(league_id, season)
        elif match_type == 'recent' or match_type == 'finished':
            api_matches = rapidapi_service.get_finished_fixtures_by_season(league_id, season)
            # Filter for recent matches (last 30 days) if needed
            if match_type == 'recent':
                from datetime import datetime, timedelta
                thirty_days_ago = datetime.now() - timedelta(days=30)
                api_matches = [
                    match for match in api_matches
                    if _parse_match_date(match) and _parse_match_date(match) > thirty_days_ago
                ]
        elif match_type == 'live':
            api_matches = rapidapi_service.get_live_fixtures_by_season(league_id, season)
        else:  # all
            api_matches = rapidapi_service.get_current_season_fixtures(league_id)

        logger.info(f"Raw API returned {len(api_matches)} matches")

        if not api_matches:
            return jsonify({
                'success': True,
                'data': [],
                'count': 0,
                'message': f'No matches found for league {league_id} in season {season}',
                'league_id': league_id,
                'season': season,
                'type': match_type
            })

        # Transform data
        matches = []
        for fixture in api_matches:
            try:
                transformed = transform_rapidapi_fixture(fixture)
                if transformed:
                    matches.append(transformed)
            except Exception as e:
                logger.error(f"Error transforming fixture: {e}")
                continue

        # Filter by team name if provided
        if team_name:
            filtered_matches = []
            for match in matches:
                home_name = match.get('home_team', {}).get('name', '').lower()
                away_name = match.get('away_team', {}).get('name', '').lower()
                if team_name in home_name or team_name in away_name:
                    filtered_matches.append(match)
            matches = filtered_matches

        logger.info(f"Returning {len(matches)} transformed matches")

        return jsonify({
            'success': True,
            'data': matches,
            'count': len(matches),
            'source': 'rapidapi',
            'league_id': league_id,
            'season': season,
            'type': match_type
        })

    except Exception as e:
        logger.error(f"Error fetching matches: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch matches data',
            'details': str(e)
        }), 500

def _parse_match_date(match):
    """Helper function to parse match date"""
    try:
        from datetime import datetime
        date_str = match.get("fixture", {}).get("date", "")
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except:
        return None

@match_bp.route('/api/matches/today', methods=['GET'])
def get_today_matches():
    """Get today's matches"""
    try:
        league_id = request.args.get('league', type=int)

        api_matches = rapidapi_service.get_today_fixtures(league_id)
        matches = [transform_rapidapi_fixture(fixture) for fixture in api_matches]

        return jsonify({
            'success': True,
            'data': matches,
            'count': len(matches),
            'date': datetime.now().strftime('%Y-%m-%d'),
            'league_id': league_id
        })

    except Exception as e:
        logger.error(f"Error fetching today's matches: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch today\'s matches'
        }), 500

@match_bp.route('/api/matches/date/<date>', methods=['GET'])
def get_matches_by_date(date):
    """Get matches for a specific date (YYYY-MM-DD)"""
    try:
        league_id = request.args.get('league', type=int)

        # Validate date format
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }), 400

        api_matches = rapidapi_service.get_fixtures_by_date(date, league_id)
        matches = [transform_rapidapi_fixture(fixture) for fixture in api_matches]

        return jsonify({
            'success': True,
            'data': matches,
            'count': len(matches),
            'date': date,
            'league_id': league_id
        })

    except Exception as e:
        logger.error(f"Error fetching matches for date {date}: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to fetch matches for {date}'
        }), 500

@match_bp.route('/api/matches/team/<int:team_id>', methods=['GET'])
def get_team_matches(team_id):
    """Get matches for a specific team"""
    try:
        last = request.args.get('last', 5, type=int)
        next_matches = request.args.get('next', 5, type=int)

        api_matches = rapidapi_service.get_fixtures_by_team(team_id, last, next_matches)
        matches = [transform_rapidapi_fixture(fixture) for fixture in api_matches]

        return jsonify({
            'success': True,
            'data': matches,
            'count': len(matches),
            'team_id': team_id,
            'last': last,
            'next': next_matches
        })

    except Exception as e:
        logger.error(f"Error fetching matches for team {team_id}: {e}")
        return jsonify({
            'success': False,
            'error': f'Failed to fetch matches for team {team_id}'
        }), 500

@match_bp.route('/api/matches/live', methods=['GET'])
def get_live_matches():
    """Get currently live matches"""
    try:
        league_id = request.args.get('league', type=int)

        api_matches = rapidapi_service.get_live_fixtures(league_id)
        matches = [transform_rapidapi_fixture(fixture) for fixture in api_matches]

        return jsonify({
            'success': True,
            'data': matches,
            'count': len(matches),
            'league_id': league_id
        })

    except Exception as e:
        logger.error(f"Error fetching live matches: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch live matches'
        }), 500

@match_bp.route('/api/matches/debug/test-date', methods=['GET'])
def debug_test_date():
    """Debug endpoint to test date-based fixture calls"""
    try:
        league_id = request.args.get('league', 39, type=int)
        test_date = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))

        logger.info(f"Testing fixtures for date {test_date}, league {league_id}")

        # Test different approaches
        results = {}

        # Test 1: Specific date
        fixtures_by_date = rapidapi_service.get_fixtures_by_date(test_date, league_id)
        results['by_date'] = {
            'count': len(fixtures_by_date),
            'sample': fixtures_by_date[:1] if fixtures_by_date else []
        }

        # Test 2: Date range (last 7 days)
        from datetime import datetime, timedelta
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

        fixtures_by_range = rapidapi_service.get_fixtures_by_date_range(start_date, end_date, league_id)
        results['by_range'] = {
            'from': start_date,
            'to': end_date,
            'count': len(fixtures_by_range),
            'sample': fixtures_by_range[:1] if fixtures_by_range else []
        }

        # Test 3: Live fixtures
        live_fixtures = rapidapi_service.get_live_fixtures(league_id)
        results['live'] = {
            'count': len(live_fixtures),
            'sample': live_fixtures[:1] if live_fixtures else []
        }

        # Test 4: Without league filter
        fixtures_all_leagues = rapidapi_service.get_fixtures_by_date(test_date)
        results['all_leagues'] = {
            'count': len(fixtures_all_leagues),
            'sample': fixtures_all_leagues[:2] if fixtures_all_leagues else []
        }

        return jsonify({
            'success': True,
            'test_date': test_date,
            'league_id': league_id,
            'results': results,
            'recommendations': [
                'Check which approach returns data',
                'If all_leagues has data but specific league doesnt, the league might be inactive',
                'If by_range has data, use date range approach in your app'
            ]
        })

    except Exception as e:
        logger.error(f"Debug test error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500