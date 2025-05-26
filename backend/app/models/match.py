from app.services.db import db
from datetime import datetime
from sqlalchemy import or_
from sqlalchemy.orm import aliased

class Match(db.Model):
    __tablename__ = 'matches'

    id = db.Column(db.Integer, primary_key=True)
    home_team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    away_team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    competition = db.Column(db.String(100))
    match_date = db.Column(db.DateTime, default=datetime.utcnow)

    home_team = db.relationship('Team', foreign_keys=[home_team_id])
    away_team = db.relationship('Team', foreign_keys=[away_team_id])

    def __repr__(self):
        return f"<Match {self.home_team.name} vs {self.away_team.name} on {self.match_date}>"

    @classmethod
    def search_by_team_name(cls, team_name):
        """
        Search matches by team name (home or away)
        """
        if not team_name:
            return cls.query.order_by(cls.match_date).all()

        from app.models.team import Team  # Import here to avoid circular imports

        search_term = f"%{team_name}%"
        HomeTeam = aliased(Team)
        AwayTeam = aliased(Team)

        return cls.query\
            .join(HomeTeam, cls.home_team_id == HomeTeam.id)\
            .join(AwayTeam, cls.away_team_id == AwayTeam.id)\
            .filter(
                or_(
                    HomeTeam.name.ilike(search_term),
                    AwayTeam.name.ilike(search_term)
                )
            )\
            .order_by(cls.match_date)\
            .all()
