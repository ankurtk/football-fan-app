from app.services.db import db
from sqlalchemy import or_

class Area(db.Model):
    __tablename__ = 'areas'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    country_code = db.Column(db.String(10))

    def __repr__(self):
        return f"<Area {self.name}>"

    @classmethod
    def get_filtered_areas(cls, filters=None):
        """
        Get areas with applied filters
        filters: dict with possible keys:
        - search: Search by name
        - country_code: Filter by country code
        """
        query = cls.query

        if filters:
            if 'search' in filters and filters['search']:
                search_term = f"%{filters['search']}%"
                query = query.filter(cls.name.ilike(search_term))

            if 'country_code' in filters and filters['country_code']:
                query = query.filter(cls.country_code == filters['country_code'])

        return query.order_by(cls.name).all()

    @classmethod
    def search_areas(cls, search_term):
        """
        Search areas by name or country code
        """
        if not search_term:
            return []

        search_term = f"%{search_term}%"
        return cls.query.filter(
            or_(
                cls.name.ilike(search_term),
                cls.country_code.ilike(search_term)
            )
        ).all()