import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { Team, teamService } from '../apis/getTeams.api';
;

const TeamsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teamService.getTeams(searchTerm);
        setTeams(data);
      } catch (err) {
        setError('Failed to fetch teams. Please try again later.');
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchTeams();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Teams</h1>
        <p className="text-gray-600">Browse and search football teams.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for a team..."
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

      {/* Teams Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teams.map(team => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{team.name}</h3>
                <div className="text-sm text-gray-600">
                  <p>Area: {team.area}</p>
                  <p>Founded: {team.founded}</p>
                  <p>Venue: {team.venue}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && teams.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No teams found. Try adjusting your search.
        </div>
      )}
    </div>
  );
};

export default TeamsPage;