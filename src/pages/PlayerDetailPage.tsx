import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';
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

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/players/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load player data');
        console.error('Error fetching player data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlayerData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-gray-600">{error || 'Player not found'}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Player Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-xl mb-8 overflow-hidden">
        <div className="p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{player.name}</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <span className="block text-sm text-green-100">Position</span>
              <span className="text-lg font-medium">{player.position}</span>
            </div>
            <div>
              <span className="block text-sm text-green-100">Nationality</span>
              <span className="text-lg font-medium">{player.nationality}</span>
            </div>
            <div>
              <span className="block text-sm text-green-100">Team</span>
              <span className="text-lg font-medium">{player.team.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Player Information */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <User size={20} className="mr-2 text-green-600" />
          Player Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Name</h4>
            <p className="font-medium">{player.name}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Position</h4>
            <p className="font-medium">{player.position}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Nationality</h4>
            <p className="font-medium">{player.nationality}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-1">Team</h4>
            <p className="font-medium">{player.team.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;