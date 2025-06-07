import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { Team, teamService } from '../apis/getTeams.api';
import CompetitionSelector from '../components/CompetitionSelector';

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState(39); // Premier League default
  const [season] = useState(2024);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use RapidAPI teams endpoint
        const data = await teamService.getTeams(selectedLeague, season);
        setTeams(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedLeague, season]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Teams</h1>
        <p className="text-gray-600">Browse teams from major football leagues with detailed statistics.</p>
      </div>

      {/* League Selector */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <CompetitionSelector
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
          className="md:w-64"
        />

        <div className="text-sm text-gray-600 flex items-center">
          Season: {season} | {teams.length} teams
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
              to={`/teams/${team.id}?use_rapidapi=true`}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                {/* Team Logo */}
                {team.logo && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <h3 className="font-semibold text-lg mb-2 text-center">{team.name}</h3>
                <div className="text-sm text-gray-600 text-center">
                  <p>Country: {team.country}</p>
                  {team.founded && <p>Founded: {team.founded}</p>}
                  {team.venue && <p>Venue: {team.venue}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && teams.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No teams found for this league. Try selecting a different competition.
        </div>
      )}
    </div>
  );
};

export default TeamsPage;