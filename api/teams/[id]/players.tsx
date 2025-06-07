export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id, season } = req.query;
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  try {
    const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3/players?team=${id}&season=${season || 2024}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey || '',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    const data = await response.json();

    // Transform players data
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
          appearances: games.appearences || 0, // Note: API uses 'appearences'
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
      count: players.length,
      team_id: id,
      season_used: season || 2024,
      data_source: 'rapidapi'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch players data'
    });
  }
}