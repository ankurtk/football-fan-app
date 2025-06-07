export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { league, season, search, id } = req.query;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  try {
    if (!rapidApiKey) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    // Handle individual team request
    if (id) {
      console.log('Fetching individual team:', id);

      const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/teams?id=${id}&season=${season || 2024}`, {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`RapidAPI responded with ${response.status}`);
      }

      const data = await response.json();
      const teamData = data.response?.[0];

      if (!teamData) {
        return res.status(404).json({
          success: false,
          error: 'Team not found'
        });
      }

      const team = {
        id: teamData.team.id,
        name: teamData.team.name,
        code: teamData.team.code,
        country: teamData.team.country,
        founded: teamData.team.founded,
        national: teamData.team.national,
        logo: teamData.team.logo,
        crest: teamData.team.logo,
        venue: teamData.venue?.name,
        venue_details: {
          id: teamData.venue?.id,
          name: teamData.venue?.name,
          address: teamData.venue?.address,
          city: teamData.venue?.city,
          capacity: teamData.venue?.capacity,
          surface: teamData.venue?.surface,
          image: teamData.venue?.image
        }
      };

      return res.json({
        success: true,
        data: team
      });
    }

    // Handle teams list request
    const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/teams?league=${league || 39}&season=${season || 2024}${search ? `&search=${search}` : ''}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    const data = await response.json();

    const teams = data.response?.map(item => ({
      id: item.team.id,
      name: item.team.name,
      code: item.team.code,
      country: item.team.country,
      founded: item.team.founded,
      national: item.team.national,
      logo: item.team.logo,
      crest: item.team.logo,
      venue: item.venue?.name,
      venue_details: {
        id: item.venue?.id,
        name: item.venue?.name,
        address: item.venue?.address,
        city: item.venue?.city,
        capacity: item.venue?.capacity,
        surface: item.venue?.surface,
        image: item.venue?.image
      }
    })) || [];

    return res.json({
      success: true,
      data: teams,
      count: teams.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch teams data',
      details: error.message
    });
  }
}