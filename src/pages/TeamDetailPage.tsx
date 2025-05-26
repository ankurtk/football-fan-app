import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, MapPin, Calendar, Shield } from 'lucide-react';
import { Team, teamService } from '../apis/getTeams.api';
import { Player, playerService } from '../apis/getPlayers.api';
import Spinner from '../components/ui/Spinner';

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      if (!id) return;

      try {
        // Fetch team details using your teamService
        const teamResponse = await teamService.getTeamById(Number(id));
        setTeam(teamResponse);

        // Fetch players for this team using playerService
        const playersData = await playerService.getPlayers({ team_id: Number(id) });
        setPlayers(playersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
        setPlayersLoading(false);
      }
    };

    fetchTeamAndPlayers();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error || 'Team not found'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{team.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>{team.area}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>Founded {team.founded}</span>
              </div>
              <div className="flex items-center">
                <Shield size={16} className="mr-1" />
                <span>{team.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Users className="text-blue-600" />
          Squad Members
        </h2>

        {playersLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {players.map((player) => (
              <Link
                key={player.id}
                to={`/players/${player.id}`}
                className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        {player.position}
                      </span>
                      <span className="text-xs text-gray-500">
                        {player.nationality}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No players found
            </h3>
            <p className="text-gray-500">
              No players are currently registered with this team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetailPage;