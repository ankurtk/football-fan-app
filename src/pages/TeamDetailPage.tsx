import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Calendar} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { teamService, Team } from '../apis/getTeams.api';
import { playerService, Player } from '../apis/getPlayers.api';
import PlayerCard from '../components/PlayerCard';

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // Get league from URL params instead of using hardcoded default
  const leagueId = parseInt(searchParams.get('league') || '39');

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'squad'>('overview');
  const [season] = useState(2024);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Pass the league ID from URL params
        const teamData = await teamService.getTeamById(Number(id), season, leagueId);
        setTeam(teamData);

      } catch (err) {
        console.error('Error fetching team:', err);
        setError('Failed to load team details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id, leagueId, season]);

  // Fetch players when squad tab is selected
  useEffect(() => {
    const fetchPlayers = async () => {
      if (activeTab !== 'squad' || !id) return;

      try {
        setPlayersLoading(true);
        // Since we're using RapidAPI for both teams and players, IDs are consistent
        const playersData = await playerService.getPlayersByTeam(parseInt(id), season,leagueId);
        setPlayers(playersData);
      } catch (err) {
        console.error('Error fetching players:', err);
        setPlayers([]);
      } finally {
        setPlayersLoading(false);
      }
    };

    fetchPlayers();
  }, [activeTab, id, season]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Team not found'}
        </div>
        <Link
          to="/teams"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Teams
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/teams"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Teams
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Team Logo */}
            {team.logo && (
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}

            {/* Team Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{team.country}</span>
                </div>
                {team.founded && (
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>Founded: {team.founded}</span>
                  </div>
                )}
                {team.venue && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>{team.venue}</span>
                  </div>
                )}
                {team.venue_details?.capacity && (
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    <span>Capacity: {team.venue_details.capacity.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('squad')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'squad'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Squad {players.length > 0 && `(${players.length})`}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Team Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Full Name:</span>
                <p className="text-gray-600">{team.name}</p>
              </div>
              <div>
                <span className="font-medium">Country:</span>
                <p className="text-gray-600">{team.country}</p>
              </div>
              {team.founded && (
                <div>
                  <span className="font-medium">Founded:</span>
                  <p className="text-gray-600">{team.founded}</p>
                </div>
              )}
              {team.code && (
                <div>
                  <span className="font-medium">Code:</span>
                  <p className="text-gray-600">{team.code}</p>
                </div>
              )}
            </div>
          </div>

          {team.venue_details && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Stadium Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span>
                  <p className="text-gray-600">{team.venue_details.name}</p>
                </div>
                <div>
                  <span className="font-medium">City:</span>
                  <p className="text-gray-600">{team.venue_details.city}</p>
                </div>
                {team.venue_details.capacity && (
                  <div>
                    <span className="font-medium">Capacity:</span>
                    <p className="text-gray-600">{team.venue_details.capacity.toLocaleString()}</p>
                  </div>
                )}
                {team.venue_details.surface && (
                  <div>
                    <span className="font-medium">Surface:</span>
                    <p className="text-gray-600">{team.venue_details.surface}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'squad' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {playersLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {players.map(player => (
                <Link
                  key={player.id}
                  to={`/players/${player.id}?league=${leagueId}`}
                >
                  <PlayerCard player={player} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No squad data available</h3>
              <p className="text-gray-500">
                Squad information for this team is not available for the current season.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamDetailPage;