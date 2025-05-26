from app.services.db import db
from sqlalchemy import or_

class Team(db.Model):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    area = db.Column(db.String(100))
    founded = db.Column(db.Integer)
    venue = db.Column(db.String(100))

    def __repr__(self):
        return f"<Team {self.name}>"

    @classmethod
    def search_by_name(cls, search_term):
        """
        Search teams by name only
        """
        if not search_term:
            return cls.query.all()

        search_term = f"%{search_term}%"
        return cls.query.filter(cls.name.ilike(search_term)).order_by(cls.name).all()

    @classmethod
    def get_filtered_teams(cls, filters=None):
        query = cls.query

        if filters:
            if 'area' in filters and filters['area']:
                print(f"Filtering by area: {filters['area']}")
                # Check case sensitivity
                query = query.filter(db.func.lower(cls.area) == db.func.lower(filters['area']))
                # Debug the SQL query
                print("SQL Query:", query)

        teams = query.order_by(cls.name).all()
        print(f"Found {len(teams)} teams")
        return teams