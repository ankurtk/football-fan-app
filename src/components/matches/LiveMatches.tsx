import React from 'react';
import { useFootballApi } from '../../hooks/useFootballApi';
import { Match } from '../../types/api';
import { format } from 'date-fns';
import Spinner from '../ui/Spinner';

const LiveMatches: React.FC = () => {
  const { getLiveMatches, loading, error } = useFootballApi();
  const [matches, setMatches] = React.useState<Match[]>([]);

  React.useEffect(() => {
    const fetchMatches = async () => {
      const data = await getLiveMatches();
      setMatches(data);
    };
    fetchMatches();
  }, [getLiveMatches]);

  if (loading) {
    return <Spinner size="lg" />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match) => (
        <div key={match.id} className="bg-white rounded-lg shadow p-4">
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">{match.league.name}</span>
            <p className="text-xs text-gray-400">
              {format(new Date(match.date), 'HH:mm')}
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <img 
                src={match.homeTeam.logo} 
                alt={match.homeTeam.name}
                className="w-8 h-8 mx-auto mb-2"
              />
              <p className="font-semibold">{match.homeTeam.name}</p>
              {match.homeTeam.score !== undefined && (
                <p className="text-xl font-bold">{match.homeTeam.score}</p>
              )}
            </div>
            
            <div className="mx-4">
              <span className="text-sm font-semibold text-gray-500">VS</span>
            </div>
            
            <div className="text-center flex-1">
              <img 
                src={match.awayTeam.logo} 
                alt={match.awayTeam.name}
                className="w-8 h-8 mx-auto mb-2"
              />
              <p className="font-semibold">{match.awayTeam.name}</p>
              {match.awayTeam.score !== undefined && (
                <p className="text-xl font-bold">{match.awayTeam.score}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
              {match.status}
            </span>
          </div>
        </div>
      ))}
      
      {matches.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No live matches at the moment.
        </div>
      )}
    </div>
  );
};

export default LiveMatches;