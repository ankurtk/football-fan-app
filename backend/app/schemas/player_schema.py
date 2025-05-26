from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
from app.models.player import Player
from app.schemas.team_schema import TeamSchema
from app.services.db import db

class PlayerSchema(SQLAlchemyAutoSchema):
    team = fields.Nested(TeamSchema)

    class Meta:
        model = Player
        sqla_session = db.session
        load_instance = True
        include_fk = True
