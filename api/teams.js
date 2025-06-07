export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { league, season, search } = req.query;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  try {
    if (!rapidApiKey) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

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
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch teams data'
    });
  }
}