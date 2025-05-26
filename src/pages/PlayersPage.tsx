import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import { Users } from 'lucide-react';

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

const PlayersPage: React.FC = () => {
  const location = useLocation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get nationality from location state
  const nationality = location.state?.nationality;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        // Add nationality to API call if it exists
        const url = nationality
          ? `http://localhost:5000/api/players?nationality=${encodeURIComponent(nationality)}`
          : 'http://localhost:5000/api/players';

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        setPlayers(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [nationality]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Players</h1>
        <p className="text-gray-600">Browse and search for players.</p>
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
            <div
              key={player.id}
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
            </div>
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