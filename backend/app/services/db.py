from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    # Configure your database URI here; using SQLite for simplicity
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sports.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
