export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract all query parameters
  const { id } = req.query;
  const season = req.query.season || 2024;
  const league = req.query.league || 39;

  // For debugging
  console.log(`Player API called with id=${id}, season=${season}, league=${league}`);

  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
      console.error('API key is not configured');
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    // Force no-cache to ensure fresh data
    const apiUrl = `https://api-football-v1.p.rapidapi.com/v3/players?id=${id}&season=${season}&league=${league}`;
    console.log('Calling RapidAPI:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        // Force fresh data
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error(`RapidAPI error: ${response.status}`);
      return res.status(response.status).json({
        success: false,
        error: `RapidAPI responded with ${response.status}`,
        url: apiUrl
      });
    }

    const data = await response.json();
    console.log('RapidAPI response:', JSON.stringify(data).substring(0, 200) + '...');

    // Check if player data exists
    if (!data.response || data.response.length === 0) {
      console.log('No player data found');
      return res.status(404).json({
        success: false,
        error: 'Player not found',
        debug: {
          id,
          season,
          league,
          responsePreview: data
        }
      });
    }

    // Get player data from first result
    const playerData = data.response[0];
    const player = playerData.player;
    const statistics = playerData.statistics && playerData.statistics.length > 0
      ? playerData.statistics[0]
      : {};

    // Transform data
    const transformedPlayer = {
      id: player.id,
      name: player.name,
      firstname: player.firstname,
      lastname: player.lastname,
      age: player.age,
      nationality: player.nationality,
      height: player.height,
      weight: player.weight,
      photo: player.photo,
      // Add other fields as needed
      statistics: {
        // Map statistics fields here
      }
    };

    console.log(`Successfully retrieved player ${player.name}`);
    return res.json({
      success: true,
      data: transformedPlayer
    });

  } catch (error) {
    console.error('Player API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}