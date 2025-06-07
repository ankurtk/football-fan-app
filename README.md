# Football Tracker

A modern web application for tracking football matches, teams, and players with real-time data from external APIs and comprehensive statistics.

## Features

- **Live Match Tracking**
  - Real-time live matches from all major leagues
  - Live scores and match status updates
  - Auto-refreshing live data
  
- **Match Management**
  - View upcoming matches with detailed information
  - Search matches by team name
  - Filter by different leagues (Premier League, La Liga, Serie A, etc.)
  - Match details with venue, date, and competition info

- **Team Profiles**
  - Browse team information and statistics
  - View team roster and player details
  - Team-specific match history

- **Player Search**
  - Comprehensive player search functionality
  - Detailed player statistics and profiles
  - Position, nationality, and performance data

- **Modern UI/UX**
  - Responsive design for all devices
  - Clean, intuitive interface
  - Real-time data updates
  - Manual refresh capabilities

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Lucide React** for icons
- **React Router v6** for navigation
- **Axios** for API requests
- **Date-fns** for date formatting
- **Vite** for build tooling

### Backend
- **Python Flask** RESTful API
- **RapidAPI** integration for live football data
- **External API** data transformation
- **CORS** enabled for cross-origin requests

### APIs Used
- **RapidAPI Football API** - Live matches, teams, and player data
- Real-time data fetching and caching
- Multiple league support

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- npm or yarn
- RapidAPI account and API key

### Installation

1. **Clone the repository:**
```bash
git clone <your-repository-url>
cd football-tracker
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
```

4. **Set up the backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

5. **Start the development servers:**

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
python -m app.main
```

## API Endpoints

### Matches
- `GET /api/matches` - Get matches with filtering options
- `GET /api/matches/live` - Get currently live matches
- `GET /api/matches/live?league=39` - Get live matches for specific league
- `GET /api/matches?league=39&type=upcoming` - Get upcoming matches
- `GET /api/matches/:id` - Get match details (under development)

### Teams
- `GET /api/teams` - Get teams by league
- `GET /api/teams/:id` - Get team details
- `GET /api/teams?league=39` - Get teams from specific league

### Players
- `GET /api/players/search?name=:name` - Search players by name
- `GET /api/players/:id` - Get player details

### Areas
- `GET /api/areas` - Under construction
- `GET /api/areas/:id` - Under construction

## Features Overview

### Live Matches
- **Real-time data** from RapidAPI
- **Multiple leagues** support (Premier League, La Liga, Serie A, Bundesliga, Ligue 1)
- **Hybrid filtering** - All leagues or specific league
- **Search functionality** for team names
- **Unclickable live cards** to prevent errors

### Match Filtering
- **Upcoming matches** - Next 2 weeks
- **Live matches** - Currently ongoing
- **League-specific** filtering
- **Team name search** with debouncing

### UI Components
- **Featured Matches** section on homepage
- **Manual refresh** buttons with loading states
- **Error handling** with cached data fallback
- **Responsive design** for mobile and desktop
- **Under construction** pages for future features

## Development

### Development URLs
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

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

# Preview production build
npm run preview
```

### Backend Scripts
```bash
# Start Flask development server
cd backend
python -m app.main

# Run with specific environment
FLASK_ENV=development python -m app.main
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_RAPIDAPI_KEY=your_rapidapi_key
```

### Backend (.env)
```env
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
FLASK_ENV=development
```

## API Integration

The application uses **RapidAPI's Football API** for real-time data:

- **Live matches** - Real-time scores and status
- **Team data** - Comprehensive team information
- **Player search** - Detailed player profiles
- **Multiple leagues** - Support for major European leagues

### Data Flow
1. Frontend makes requests to local Flask API
2. Flask API calls RapidAPI endpoints
3. Data is transformed to match frontend expectations
4. Real-time updates for live matches

## Project Structure

```
football-tracker/
├── src/                          # Frontend React application
│   ├── components/              # Reusable components
│   │   ├── layout/             # Navigation, Footer
│   │   ├── matches/            # Match-related components
│   │   └── ui/                 # UI components (Spinner, UnderConstruction)
│   ├── pages/                  # Page components
│   ├── hooks/                  # Custom React hooks
│   ├── apis/                   # API service functions
│   └── utils/                  # Utility functions
├── backend/                    # Flask API backend
│   ├── app/
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utility functions
│   └── requirements.txt       # Python dependencies
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## Features Under Development

### Areas (Coming Soon)
- Interactive maps showing football regions
- Area-specific team and match listings
- Regional competition information
- Location-based statistics

### Enhanced Match Details
- Individual match detail pages
- Match statistics and lineups
- Historical match data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new frontend code
- Follow the existing component structure
- Add proper error handling for API calls
- Test responsive design on multiple screen sizes
- Use meaningful commit messages

## Troubleshooting

### Common Issues

**API Key Issues:**
- Ensure your RapidAPI key is valid and has sufficient quota
- Check that environment variables are properly set

**CORS Errors:**
- Verify Flask-CORS is properly configured
- Check that API URLs match between frontend and backend

**Live Matches Not Loading:**
- Check RapidAPI service status
- Verify network connectivity
- Check browser console for errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **RapidAPI** for providing football data
- **React** and **Flask** communities for excellent documentation
- **TailwindCSS** for the styling framework