import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users } from 'lucide-react';
import Spinner from '../components/ui/Spinner';

interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  team: {
    id: number;
    name: string;
  };
}

interface Filters {
  name?: string;
  nationality?: string;
  position?: string;
  team_name?: string;
}

const PlayersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.nationality) params.append('nationality', filters.nationality);
        if (filters.position) params.append('position', filters.position);
        if (filters.team_name) params.append('team_name', filters.team_name);

        const response = await fetch(`http://localhost:5000/api/players?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }

        const data = await response.json();
        setPlayers(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load players');
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchPlayers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Players</h1>
        <p className="text-gray-600">Browse and search for players.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search players..."
              value={filters.name || ''}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                value={filters.nationality || ''}
                onChange={(e) => handleFilterChange('nationality', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Filter by nationality"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={filters.position || ''}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Filter by position"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
              <input
                type="text"
                value={filters.team_name || ''}
                onChange={(e) => handleFilterChange('team_name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Filter by team"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Players Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map(player => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">{player.name}</h3>
                <p className="text-gray-600">{player.position}</p>
                <p className="text-sm text-gray-500">{player.team.name}</p>
                <p className="text-sm text-gray-500">{player.nationality}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && players.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
          <p className="text-gray-600">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;