import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { Match, matchService } from '../apis/getMatches.api';


const MatchesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await matchService.getMatches(searchTerm);
        setMatches(data);
      } catch (err) {
        setError('Failed to fetch matches. Please try again later.');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchMatches();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Matches</h1>
        <p className="text-gray-600">Browse upcoming matches and search by team name.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search matches by team name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Matches Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">{match.competition}</p>
                <p className="text-sm text-gray-500">
                  {new Date(match.match_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <p className="font-semibold">{match.home_team.name}</p>
                </div>
                <div className="mx-4 text-gray-500">vs</div>
                <div className="text-center flex-1">
                  <p className="font-semibold">{match.away_team.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No matches found. Try adjusting your search.
        </div>
      )}
    </div>
  );
};

export default MatchesPage;