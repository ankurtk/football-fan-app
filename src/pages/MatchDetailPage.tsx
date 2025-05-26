import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Spinner from '../components/ui/Spinner';
import { Match } from '../hooks/useMatches';

const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/matches/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch match details');
        }
        const data = await response.json();
        setMatch(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match details');
        console.error('Error fetching match:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMatch();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error || 'Match not found'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Match Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {match.competition}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>{format(new Date(match.match_date), 'EEEE, MMMM d, yyyy - HH:mm')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
            <MapPin size={16} />
            <span>{match.home_team.venue}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">{match.home_team.name}</h2>
            <p className="text-sm text-gray-500">{match.home_team.area}</p>
          </div>
          <div className="text-center self-center">
            <span className="text-2xl font-bold text-gray-400">vs</span>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">{match.away_team.name}</h2>
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Match Details</h2>
        <div className="space-y-4">
          <div>
            <span className="text-gray-500">Venue:</span>
            <span className="ml-2 font-medium">{match.home_team.venue}</span>
          </div>
          <div>
            <span className="text-gray-500">Competition:</span>
            <span className="ml-2 font-medium">{match.competition}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <span className="ml-2 font-medium">
              {format(new Date(match.match_date), 'MMMM d, yyyy')}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>
            <span className="ml-2 font-medium">
              {format(new Date(match.match_date), 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPage;