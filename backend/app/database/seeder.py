from app.models.team import Team
from app.models.player import Player
from app.models.match import Match
from app.models.area import Area
from app.services.db import db
from datetime import datetime

class DatabaseSeeder:
    @staticmethod
    def seed_database():
        # Check if database is already seeded
        existing_areas = db.session.query(Area).first()
        if existing_areas:
            return

        # Seed Areas
        areas = [
            Area(name="England", country_code="ENG"),
            Area(name="Spain", country_code="ESP"),
            Area(name="Germany", country_code="GER"),
            Area(name="Italy", country_code="ITA"),
            Area(name="France", country_code="FRA"),
            Area(name="Netherlands", country_code="NED"),
            Area(name="Portugal", country_code="POR")
        ]

        db.session.add_all(areas)
        db.session.commit()

        # Seed Teams
        teams = [
            # Premier League
            Team(name="Manchester United", area="England", founded=1878, venue="Old Trafford"),
            Team(name="Liverpool", area="England", founded=1892, venue="Anfield"),
            Team(name="Arsenal", area="England", founded=1886, venue="Emirates Stadium"),
            Team(name="Chelsea", area="England", founded=1905, venue="Stamford Bridge"),
            Team(name="Manchester City", area="England", founded=1880, venue="Etihad Stadium"),

            # La Liga
            Team(name="Real Madrid", area="Spain", founded=1902, venue="Santiago Bernabéu"),
            Team(name="Barcelona", area="Spain", founded=1899, venue="Camp Nou"),
            Team(name="Atletico Madrid", area="Spain", founded=1903, venue="Metropolitano"),

            # Bundesliga
            Team(name="Bayern Munich", area="Germany", founded=1900, venue="Allianz Arena"),
            Team(name="Borussia Dortmund", area="Germany", founded=1909, venue="Signal Iduna Park"),

            # Serie A
            Team(name="AC Milan", area="Italy", founded=1899, venue="San Siro"),
            Team(name="Juventus", area="Italy", founded=1897, venue="Allianz Stadium"),

            # Ligue 1
            Team(name="Paris Saint-Germain", area="France", founded=1970, venue="Parc des Princes"),
            Team(name="Olympique Lyon", area="France", founded=1950, venue="Groupama Stadium")
        ]

        db.session.add_all(teams)
        db.session.commit()

        # Seed Players
        players = [
            # Manchester United Players
            Player(name="Marcus Rashford", position="Forward", nationality="England", team_id=1),
            Player(name="Bruno Fernandes", position="Midfielder", nationality="Portugal", team_id=1),

            # Liverpool Players
            Player(name="Mohamed Salah", position="Forward", nationality="Egypt", team_id=2),
            Player(name="Virgil van Dijk", position="Defender", nationality="Netherlands", team_id=2),

            # Real Madrid Players
            Player(name="Jude Bellingham", position="Midfielder", nationality="England", team_id=6),
            Player(name="Vinicius Jr", position="Forward", nationality="Brazil", team_id=6),

            # Barcelona Players
            Player(name="Robert Lewandowski", position="Forward", nationality="Poland", team_id=7),
            Player(name="Pedri", position="Midfielder", nationality="Spain", team_id=7),

            # Bayern Munich Players
            Player(name="Harry Kane", position="Forward", nationality="England", team_id=9),
            Player(name="Joshua Kimmich", position="Midfielder", nationality="Germany", team_id=9),

            # PSG Players
            Player(name="Kylian Mbappé", position="Forward", nationality="France", team_id=13),
            Player(name="Marquinhos", position="Defender", nationality="Brazil", team_id=13)
        ]

        db.session.add_all(players)
        db.session.commit()

        # Seed Matches
        matches = [
            # Premier League Matches
            Match(
                home_team_id=1,
                away_team_id=2,
                competition="Premier League",
                match_date=datetime(2025, 5, 1, 20, 0)
            ),
            Match(
                home_team_id=3,
                away_team_id=4,
                competition="Premier League",
                match_date=datetime(2025, 5, 2, 17, 30)
            ),

            # Champions League Matches
            Match(
                home_team_id=6,
                away_team_id=9,
                competition="Champions League",
                match_date=datetime(2025, 5, 7, 20, 0)
            ),
            Match(
                home_team_id=7,
                away_team_id=13,
                competition="Champions League",
                match_date=datetime(2025, 5, 8, 20, 0)
            ),

            # Domestic Cup Matches
            Match(
                home_team_id=11,
                away_team_id=12,
                competition="Coppa Italia",
                match_date=datetime(2025, 5, 15, 20, 45)
            ),
            Match(
                home_team_id=9,
                away_team_id=10,
                competition="DFB-Pokal",
                match_date=datetime(2025, 5, 22, 20, 30)
            )
        ]

        db.session.add_all(matches)
        db.session.commit()