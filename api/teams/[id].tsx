export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id, season } = req.query;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  try {
    const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/teams?id=${id}&season=${season || 2024}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey || '',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

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

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch team data'
    });
  }
}