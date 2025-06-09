export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const season = req.query.season || 2024;

  console.log(`API: Fetching player ${id} for season ${season}`);

  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY not found in environment');
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    // Call RapidAPI
    const apiUrl = `https://api-football-v1.p.rapidapi.com/v3/players?id=${id}&season=${season}`;
    console.log('Calling RapidAPI:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      console.error(`RapidAPI error: ${response.status}`);
      return res.status(response.status).json({
        success: false,
        error: `RapidAPI responded with ${response.status}`
      });
    }

    const data = await response.json();
    console.log('RapidAPI response received:', JSON.stringify(data).substring(0, 200));

    // Check if player data exists
    if (!data.response || data.response.length === 0) {
      console.log('No player data found in RapidAPI response');
      return res.status(404).json({
        success: false,
        error: 'Player not found',
        debug: {
          playerId: id,
          season: season,
          responseLength: data.response ? data.response.length : 0
        }
      });
    }

    // Transform the player data
    const playerData = data.response[0];
    const player = playerData.player || {};
    const statistics = playerData.statistics?.[0] || {};

    // Extract nested data safely
    const games = statistics.games || {};
    const goals = statistics.goals || {};
    const cards = statistics.cards || {};
    const team = statistics.team || {};
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
      }
    };

    console.log(`Successfully processed player ${player.name}`);
    return res.status(200).json({
      success: true,
      data: transformedPlayer
    });

  } catch (error) {
    console.error('Player API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch player data',
      message: error.message
    });
  }
}