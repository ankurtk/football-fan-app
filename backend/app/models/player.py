from app.services.db import db
from sqlalchemy import or_

class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(50))
    nationality = db.Column(db.String(50))
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    team = db.relationship('Team', backref='players')

    def __repr__(self):
        return f"<Player {self.name}>"

    @classmethod
    def get_filtered_players(cls, filters=None):
        """
        Get players with applied filters
        filters: dict with possible keys:
        - name: Filter by player name
        - nationality: Filter by nationality
        - position: Filter by position
        - team_name: Filter by team name
        - area: Filter by team's area
        """
        from app.models.team import Team  # Import here to avoid circular imports

        query = cls.query.join(cls.team)

        if filters:
            if filters.get('name'):
                search_term = f"%{filters['name']}%"
                query = query.filter(cls.name.ilike(search_term))

            if filters.get('nationality'):
                search_term = f"%{filters['nationality']}%"
                query = query.filter(cls.nationality.ilike(search_term))

            if filters.get('position'):
                search_term = f"%{filters['position']}%"
                query = query.filter(cls.position.ilike(search_term))

            if filters.get('team_name'):
                search_term = f"%{filters['team_name']}%"
                query = query.filter(Team.name.ilike(search_term))

            if filters.get('area'):
                search_term = f"%{filters['area']}%"
                query = query.filter(Team.area.ilike(search_term))

        return query.order_by(cls.name).all()
