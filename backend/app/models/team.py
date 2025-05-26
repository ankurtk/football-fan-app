from app.services.db import db

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
