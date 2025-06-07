import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MapPin, Award, Activity, Target, Clock } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { playerService, Player } from '../apis/getPlayers.api';

interface ApiError {
  response?: {
    status: number;
    data?: {
      error: string;
      message?: string;
    };
  };
  message?: string;
}

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching player with ID: ${id}`); // Debug log

        const data = await playerService.getPlayerById(parseInt(id));
        console.log('Player data received:', data); // Debug log
        setPlayer(data);
      } catch (err: unknown) {
        console.error('Error fetching player:', err);

        const apiError = err as ApiError;

        if (apiError?.response?.status === 404) {
          setError(`Player not found. This player's detailed information might not be available in our database.`);
        } else if (apiError?.response?.data?.error) {
          setError(apiError.response.data.error);
        } else if (apiError?.response?.data?.message) {
          setError(apiError.response.data.message);
        } else if (apiError?.message) {
          setError(apiError.message);
        } else {
          setError('Failed to load player details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Better error display
  if (error || !player) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-lg mx-auto">
          {error || 'Player not found'}
        </div>
        <div className="mt-4 space-x-4">
          <Link
            to="/players"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Players
          </Link>
          <Link
            to="/players/search"
            className="inline-flex items-center text-green-600 hover:text-green-800"
          >
            Search Players by Name
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/players"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Players
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Player Photo */}
            <div className="flex-shrink-0">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=f3f4f6&color=6b7280&size=128`;
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
              <p className="text-xl text-blue-600 font-medium mb-4">{player.statistics.position}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{player.age} years old</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{player.nationality}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>Born: {player.birth.place}, {player.birth.country}</span>
                </div>
                <div className="flex items-center">
                  <Activity size={16} className="mr-2" />
                  <span>{player.height} | {player.weight}</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2 mt-4">
                {player.injured && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                    Injured
                  </span>
                )}
                {player.statistics.captain && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    Captain
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target size={20} className="mr-2 text-green-600" />
            Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Appearances</span>
              <span className="font-semibold">{player.statistics.appearances}</span>
            </div>
            <div className="flex justify-between">
              <span>Lineups</span>
              <span className="font-semibold">{player.statistics.lineups}</span>
            </div>
            <div className="flex justify-between">
              <span>Minutes</span>
              <span className="font-semibold">
                {player.statistics.minutes !== null && player.statistics.minutes !== undefined
                  ? player.statistics.minutes.toLocaleString()
                  : 'N/A'
                }
              </span>
            </div>
            {player.statistics.rating && player.statistics.rating !== '0' && (
              <div className="flex justify-between">
                <span>Average Rating</span>
                <span className="font-semibold text-orange-600">
                  {parseFloat(player.statistics.rating).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Goals & Assists */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award size={20} className="mr-2 text-blue-600" />
            Goals & Assists
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Goals</span>
              <span className="font-semibold text-green-600">
                {player.statistics.goals.total ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Assists</span>
              <span className="font-semibold text-blue-600">
                {player.statistics.goals.assists ?? 0}
              </span>
            </div>
            {(player.statistics.goals.saves ?? 0) > 0 && (
              <div className="flex justify-between">
                <span>Saves</span>
                <span className="font-semibold text-purple-600">
                  {player.statistics.goals.saves}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Discipline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock size={20} className="mr-2 text-yellow-600" />
            Discipline
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Yellow Cards</span>
              <span className="font-semibold text-yellow-600">
                {player.statistics.cards.yellow ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Red Cards</span>
              <span className="font-semibold text-red-600">
                {player.statistics.cards.red ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Team */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Current Team</h3>
        <div className="flex items-center gap-4">
          {player.current_team.logo && (
            <img
              src={player.current_team.logo}
              alt={player.current_team.name}
              className="w-12 h-12 object-contain"
            />
          )}
          <div>
            <p className="font-semibold">{player.current_team.name}</p>
            <p className="text-gray-600">{player.current_league.name} ({player.current_league.country})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;