export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get all query parameters
    const { league, season, search, id, teamId, type } = req.query;

    // First: check environment variable
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
      console.error('API key is not configured');
      return res.status(500).json({
        success: false,
        error: 'API key not configured',
        debug: { env: Object.keys(process.env).filter(k => !k.includes('SECRET')) }
      });
    }

    // ROUTE 1: Get players from a specific team
    if (teamId && type === 'players') {
      console.log(`Fetching players for team ${teamId} in league ${league || 39}`);

      try {
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/players?team=${teamId}&season=${season || 2024}&league=${league || 39}`,
          {
            headers: {
              'X-RapidAPI-Key': rapidApiKey,
              'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`RapidAPI responded with ${response.status}`);
        }

        const data = await response.json();
        console.log(`RapidAPI returned ${data.response?.length || 0} players for team ${teamId}`);

        // Transform player data
        const players = data.response?.map(item => {
          const player = item.player || {};
          const statistics = item.statistics?.[0] || {};
          const games = statistics.games || {};
          const goals = statistics.goals || {};
          const cards = statistics.cards || {};
          const team = statistics.team || {};
          const league = statistics.league || {};
          const birth = player.birth || {};

          return {
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
        }) || [];

        return res.json({
          success: true,
          data: players,
          count: players.length
        });
      } catch (error) {
        console.error('Error fetching players:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch players data',
          details: error.message
        });
      }
    }

    // ROUTE 2: Get a specific team by ID
    else if (id) {
      console.log(`Fetching team with ID: ${id}, season: ${season || 2024}`);

      // Add league parameter (39 = Premier League)
      const apiUrl = `https://api-football-v1.p.rapidapi.com/v3/teams?id=${id}&season=${season || 2024}&league=${league || 39}`;
      console.log('API URL:', apiUrl);

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
      console.log('RapidAPI response:', JSON.stringify(data).substring(0, 200) + '...');

      const teamData = data.response?.[0];

      // If no team found, return 404
      if (!teamData) {
        return res.status(404).json({
          success: false,
          error: 'Team not found',
          debug: {
            requestedId: id,
            apiUrl,
            responsePreview: data
          }
        });
      }

      // Transform team data
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

    // ROUTE 3: Get a list of teams
    else {
      console.log(`Fetching teams for league: ${league || 39}, season: ${season || 2024}`);

      const response = await fetch(
        `https://api-football-v1.p.rapidapi.com/v3/teams?league=${league || 39}&season=${season || 2024}${search ? `&search=${search}` : ''}`,
        {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`RapidAPI responded with ${response.status}`);
      }

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
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch teams data',
      details: error.message,
      stack: error.stack
    });
  }
}