from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.team import Team
from app.services.db import db

class TeamSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Team
        sqla_session = db.session
        load_instance = True
