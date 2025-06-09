import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import PlayerCard from '../components/PlayerCard';
import { playerService, Player } from '../apis/getPlayers.api';

const PlayerSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialName = searchParams.get('name') || '';

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialName);

  useEffect(() => {
    if (initialName) {
      handleSearch(initialName);
    }
  }, [initialName]);

  const handleSearch = async (name: string) => {
    if (!name.trim()) {
      setPlayers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const playersData = await playerService.searchPlayers(name);
      setPlayers(playersData);
    } catch{
      setError('Failed to search players. Please try again.');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/teams"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Teams
        </Link>

        <h1 className="text-3xl font-bold mb-2">Player Search</h1>
        <p className="text-gray-600">Search for detailed player information.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={onSearchSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter player name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Results */}
      {!loading && players.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {players.map(player => (
            <Link
              key={player.id}
              to={`/players/${player.id}?league=${player.current_league?.id || '39'}`}
            >
              <PlayerCard player={player} />
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && searchTerm && players.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No players found matching "{searchTerm}". Try a different spelling or search for a well-known player like "Messi", "Ronaldo", or "Haaland".
        </div>
      )}

      {/* Initial State */}
      {!loading && !searchTerm && players.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Enter a player name to search for detailed statistics and information.
        </div>
      )}
    </div>
  );
};

export default PlayerSearchPage;