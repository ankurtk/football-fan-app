export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { league, type, team_name } = req.query;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    let apiUrl = 'https://api-football-v1.p.rapidapi.com/v3/fixtures';
    let params = {};

    // Handle different match types
    if (req.url.includes('live') || type === 'live') {
      params.live = 'all';
      if (league && league !== '0') {
        params.league = league;
      }
    } else if (type === 'upcoming') {
      params.next = '50';
      if (league && league !== '0') {
        params.league = league;
      }
    } else {
      // Default matches
      if (league) params.league = league;
      params.season = '2024';
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${apiUrl}?${queryString}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`RapidAPI responded with ${response.status}`);
    }

    const data = await response.json();

    // Transform matches data
    let matches = data.response?.map(fixture => ({
      id: fixture.fixture.id,
      home_team: {
        id: fixture.teams.home.id,
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo,
        crest: fixture.teams.home.logo
      },
      away_team: {
        id: fixture.teams.away.id,
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo,
        crest: fixture.teams.away.logo
      },
      match_date: fixture.fixture.date,
      status: fixture.fixture.status.long,
      status_short: fixture.fixture.status.short,
      score: {
        home: fixture.goals.home,
        away: fixture.goals.away
      },
      competition: fixture.league.name,
      competition_id: fixture.league.id,
      venue: fixture.fixture.venue?.name || 'TBD',
      referee: fixture.fixture.referee || 'TBD',
      round: fixture.league.round || 'Regular Season'
    })) || [];

    // Apply team name filter if provided
    if (team_name) {
      const searchTerm = team_name.toLowerCase();
      matches = matches.filter(match =>
        match.home_team.name.toLowerCase().includes(searchTerm) ||
        match.away_team.name.toLowerCase().includes(searchTerm)
      );
    }

    return res.json({
      success: true,
      data: matches,
      count: matches.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch matches data',
      details: error.message
    });
  }
}