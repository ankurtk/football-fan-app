export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const season = req.query.season || 2024;
  // Remove league parameter - not needed per documentation

  console.log(`API: Fetching player ${id} for season ${season}`);

  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    // FIXED: Match the exact RapidAPI URL format - no league parameter
    const apiUrl = `https://api-football-v1.p.rapidapi.com/v3/players?id=${id}&season=${season}`;
    console.log('Calling RapidAPI:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`RapidAPI responded with ${response.status}`);
    }

    const data = await response.json();
    const playerData = data.response?.[0];

    if (!playerData) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      });
    }

    const player = playerData.player || {};
    const statistics = playerData.statistics?.[0] || {};
    const games = statistics.games || {};
    const goals = statistics.goals || {};
    const cards = statistics.cards || {};
    const team = statistics.team || {};
    const league = statistics.league || {};
    const birth = player.birth || {};

    const transformedPlayer = {
      id: player.id || 0,
      name: player.name || 'Unknown',
      firstname: player.firstname || '',
      lastname: player.lastname || '',
      age: player.age || 0,
      nationality: player.nationality || 'Unknown',
      height: player.height || 'N/A',
      weight: player.weight || 'N/A',
      photo: player.photo || '',
      injured: player.injured || false,
      birth: {
        date: birth.date || '',
        place: birth.place || 'Unknown',
        country: birth.country || 'Unknown'
      },
      statistics: {
        position: games.position || 'N/A',
        appearances: games.appearences || 0,
        lineups: games.lineups || 0,
        minutes: games.minutes || 0,
        rating: games.rating || '0',
        captain: games.captain || false,
        goals: {
          total: goals.total || 0,
          assists: goals.assists || 0,
          saves: goals.saves || 0,
          conceded: goals.conceded || 0
        },
        cards: {
          yellow: cards.yellow || 0,
          red: cards.red || 0
        }
      },
      current_team: {
        id: team.id || 0,
        name: team.name || 'Unknown',
        logo: team.logo || ''
      },
      current_league: {
        id: league.id || 0,
        name: league.name || 'Unknown',
        country: league.country || 'Unknown',
        logo: league.logo || '',
        flag: league.flag || ''
      }
    };

    return res.json({
      success: true,
      data: transformedPlayer
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch player data',
      details: error.message
    });
  }
}