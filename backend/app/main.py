from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from app.services.db import init_db, db  # import db and init_db
from app.routes.teams import team_bp
from app.routes.matches import match_bp
from app.routes.players import player_bp
from app.routes.areas import area_bp
from .database.seeder import DatabaseSeeder

def create_app():
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
    app = create_app()  # create the app instance
    with app.app_context():  # push the application context
        db.create_all()  # ✅ Create tables inside app context
        DatabaseSeeder.seed_database()  # ✅ Seed data inside app context
    app.run(debug=True)
