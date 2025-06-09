export default async function handler(req, res) {
  // Get player ID and other parameters
  const { id } = req.query;
  const season = req.query.season || 2024;
  const league = req.query.league || 39;

  console.log(`API: Fetching player ${id} for league ${league}, season ${season}`);

  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Make request to football API
    const apiUrl = `https://api-football-v1.p.rapidapi.com/v3/players?id=${id}&season=${season}&league=${league}`;
    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API responded with status ${response.status}`
      });
    }

    const data = await response.json();

    // Check if we got any player data
    if (!data.response || data.response.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Format the player data
    const playerData = data.response[0];
    const player = playerData.player || {};
    const statistics = playerData.statistics?.[0] || {};

    const formattedPlayer = {
      id: player.id,
      name: player.name,
      firstname: player.firstname,
      lastname: player.lastname,
      age: player.age,
      photo: player.photo,
      nationality: player.nationality,
      height: player.height,
      weight: player.weight,
      // Add other fields as needed
      statistics: {
        team: statistics.team?.name || 'Unknown',
        position: statistics.games?.position || 'Unknown',
        // Add other statistics as needed
      }
    };

    return res.status(200).json({
      success: true,
      data: formattedPlayer
    });

  } catch (error) {
    console.error('Error fetching player:', error);
    return res.status(500).json({
      error: 'Failed to fetch player data',
      message: error.message
    });
  }
}