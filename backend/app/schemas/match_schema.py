from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
from app.models.match import Match
from app.schemas.team_schema import TeamSchema
from app.services.db import db

class MatchSchema(SQLAlchemyAutoSchema):
    home_team = fields.Nested(TeamSchema)
    away_team = fields.Nested(TeamSchema)

    class Meta:
        model = Match
        sqla_session = db.session
        load_instance = True
        include_fk = True
