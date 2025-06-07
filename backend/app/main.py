from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from dotenv import load_dotenv
from app.services.db import init_db, db
from app.routes.teams import team_bp
from app.routes.matches import match_bp
from app.routes.players import player_bp
from app.routes.areas import area_bp

def create_app():
    # Load environment variables
    load_dotenv()

    app = Flask(__name__)
    app.config['SWAGGER'] = {
        'title': 'Sports API',
        'uiversion': 3
    }
    CORS(app)
    Swagger(app)

    # Initialize the database
    init_db(app)

    @app.route('/api/health')
    def health_check():
        """
        Health Check Endpoint
        ---
        responses:
          200:
            description: API is running
        """
        return {"status": "ok"}, 200

    # Register blueprints
    app.register_blueprint(team_bp)
    app.register_blueprint(match_bp)
    app.register_blueprint(player_bp)
    app.register_blueprint(area_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
