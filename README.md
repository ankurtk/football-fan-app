# Football Tracker

A modern web application for tracking football matches, teams, and players with real-time updates and detailed statistics.

## Features

- **Match Tracking**
  - View upcoming matches
  - Detailed match statistics and information
  
- **Team Management**
  - Browse team profiles and statistics
  - View team roster and player details

- **Player Profiles**
  - Comprehensive player statistics
  - Position and nationality information

## Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Lucide React for icons
- React Router v6 for navigation
- Axios for API requests
- Date-fns for date formatting

### Backend
- Python Flask
- SQLite database
- RESTful API endpoints

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd football-tracker
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Set up the backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

## API Endpoints

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match details
- `GET /api/matches?team_name=:name` - Filter matches by team

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details
- `GET /api/teams?name=:name` - Search teams by name

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player details
- `GET /api/players?team_id=:id` - Get players by team

## Development

- Frontend runs on `http://localhost:5173`
- Backend API runs on `http://localhost:5000`

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run linter
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.