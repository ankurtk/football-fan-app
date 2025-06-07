export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name, season } = req.query;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name parameter is required'
      });
    }

    const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/players?search=${encodeURIComponent(name)}&season=${season || 2024}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey || '',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    const data = await response.json();

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
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch players data'
    });
  }
}