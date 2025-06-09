import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import PlayerCard from '../components/PlayerCard';
import { Player, playerService } from '../apis/getPlayers.api';
import { teamService, Team } from '../apis/getTeams.api';
import CompetitionSelector from '../components/CompetitionSelector';

const PlayersPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState(39); // Premier League default
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'team' | 'name'>('team');
  const [season] = useState(2024);

  // Fetch teams when league changes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        // Use RapidAPI teams endpoint
        const teamsData = await teamService.getTeams(selectedLeague, season);
        setTeams(teamsData);
        setSelectedTeam('');
        setPlayers([]);
      } catch{
        setError('Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    if (searchMode === 'team') {
      fetchTeams();
    }
  }, [selectedLeague, searchMode, season]);

  // Fetch players when team is selected
  useEffect(() => {
    const fetchPlayersByTeam = async () => {
      if (!selectedTeam || searchMode !== 'team') {
        setPlayers([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const playersData = await playerService.getPlayersByTeam(parseInt(selectedTeam), season, selectedLeague);
        setPlayers(playersData);
      } catch{
        setError('Failed to fetch players. Try selecting a different team.');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayersByTeam();
  }, [selectedTeam, searchMode, season]);


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Players</h1>
        <p className="text-gray-600">Browse players by team with detailed statistics from major leagues.</p>
      </div>

      {/* Search Mode Toggle */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSearchMode('team')}
            className={`px-4 py-2 rounded-md ${
              searchMode === 'team'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Browse by Team
          </button>
        </div>
      </div>

      {/* Filters */}
      {searchMode === 'team' ? (
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <CompetitionSelector
            selectedLeague={selectedLeague}
            onLeagueChange={setSelectedLeague}
            className="md:w-48"
          />

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-64"
          >
            <option value="">Select a team...</option>
            {teams.map(team => (
              <option key={team.id} value={team.id.toString()}>
                {team.name}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Season: {season}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search players by name (e.g., Messi, Haaland, Mbappe)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Search across all major leagues and teams.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* No Selection State */}
      {!loading && searchMode === 'team' && !selectedTeam && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Team</h3>
          <p className="text-gray-500">Choose a league and team to view players with detailed statistics.</p>
        </div>
      )}

      {/* Players Grid */}
      {!loading && players.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {players.map(player => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
            >
              <PlayerCard player={player} />
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && (
        (searchMode === 'team' && selectedTeam && players.length === 0) ||
        (searchMode === 'name' && searchTerm && players.length === 0)
      ) && (
        <div className="text-center text-gray-500 py-12">
          {searchMode === 'team'
            ? 'No players found for this team'
            : `No players found matching "${searchTerm}"`
          }
        </div>
      )}
    </div>
  );
};

export default PlayersPage;