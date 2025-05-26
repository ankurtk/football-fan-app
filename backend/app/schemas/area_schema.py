from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.area import Area
from app.services.db import db

class AreaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Area
        sqla_session = db.session
        load_instance = True
