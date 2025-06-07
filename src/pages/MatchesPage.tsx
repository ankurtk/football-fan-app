import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import CompetitionSelector from '../components/CompetitionSelector';
import { Match, matchService } from '../apis/getMatches.api';

// This is a generic hook for fetching matches with various filters
export const useMatches = (filters?: {
  league?: number;
  type?: 'upcoming' | 'live' | 'recent' | 'all'; // Remove 'today' type
  team_name?: string;
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchMatches = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Match[] = [];

      // Remove all today logic
      if (filters?.type === 'upcoming') {
        if (!filters.league || filters.league === 0) {
          // Get upcoming matches from multiple major leagues
          const leagues = [39, 140, 135, 78, 61];
          const allUpcomingMatches: Match[] = [];

          for (const league of leagues) {
            try {
              const leagueMatches = await matchService.getUpcomingMatches(league);
              allUpcomingMatches.push(...(leagueMatches || []));
            } catch {
              console.warn(`Failed to fetch upcoming matches for league ${league}`);
            }
          }
          data = allUpcomingMatches;
        } else {
          data = await matchService.getUpcomingMatches(filters.league);
        }

      } else if (filters?.type === 'live') {
        // Hybrid approach for live matches
        data = await matchService.getLiveMatches(filters.league);

      } else {
        // Default: get matches for specific league or Premier League
        const league = filters?.league || 39;
        const type = filters?.type || 'all';
        data = await matchService.getMatches(league, type, filters?.team_name);
      }

      setMatches(data || []);
      setLastFetched(new Date());
    } catch {
      setError('Failed to fetch matches');
      console.error('Error fetching matches');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Return refresh function along with other data
  return {
    matches,
    loading,
    error,
    lastFetched,
    refetch: fetchMatches
  };
};

const MatchesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const [matchType, setMatchType] = useState(searchParams.get('type') || 'all');

  // Initialize selectedLeague based on match type
  const [selectedLeague, setSelectedLeague] = useState(() => {
    // If coming from live matches, default to "All Leagues" (0)
    if (searchParams.get('type') === 'live') {
      return 0;
    }
    return 39; // Default to Premier League for other types
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching matches for league:', selectedLeague, 'type:', matchType);

        let data;

        // Handle different match types with hybrid approach
        if (matchType === 'live') {
          // Hybrid approach for live matches
          if (selectedLeague === 0) {
            // Get all live matches from all leagues
            data = await matchService.getLiveMatches();
          } else {
            // Get live matches for specific league
            data = await matchService.getLiveMatches(selectedLeague);
          }
        } else if (matchType === 'upcoming') {
          if (selectedLeague === 0) {
            // Get upcoming matches from multiple major leagues
            const leagues = [39, 140, 135, 78, 61];
            const allUpcomingMatches: Match[] = [];

            for (const league of leagues) {
              try {
                const leagueMatches = await matchService.getUpcomingMatches(league);
                allUpcomingMatches.push(...(leagueMatches || []));
              } catch (err) {
                console.warn(`Failed to fetch upcoming matches for league ${league}`);
              }
            }
            data = allUpcomingMatches;
          } else {
            data = await matchService.getUpcomingMatches(selectedLeague);
          }
        } else {
          // Default to all matches - must have a specific league
          const league = selectedLeague === 0 ? 39 : selectedLeague;
          data = await matchService.getMatches(league, 'all', searchTerm);
        }

        // Apply client-side search filtering for live and upcoming matches
        // (since these endpoints don't support team_name parameter)
        if (searchTerm && (matchType === 'live' || matchType === 'upcoming')) {
          const searchTermLower = searchTerm.toLowerCase();
          data = (data || []).filter((match: { home_team: { name: string; }; away_team: { name: string; }; }) => {
            const homeTeamName = match.home_team.name.toLowerCase();
            const awayTeamName = match.away_team.name.toLowerCase();
            return homeTeamName.includes(searchTermLower) || awayTeamName.includes(searchTermLower);
          });
        }

        console.log('Received matches:', data);
        setMatches(data || []);
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
  }, [searchTerm, selectedLeague, matchType]); // Keep searchTerm in dependencies

  // Update URL when match type changes
  const handleMatchTypeChange = (type: string) => {
    setMatchType(type);
    setSearchParams(type === 'all' ? {} : { type });

    // Auto-select "All Leagues" when switching to live matches
    if (type === 'live' && selectedLeague !== 0) {
      setSelectedLeague(0);
    }
    // Auto-select Premier League when switching away from live matches
    else if (type !== 'live' && selectedLeague === 0) {
      setSelectedLeague(39);
    }
  };

  // Get league display name for UI
  const getLeagueDisplayName = () => {
    if (selectedLeague === 0) return 'All Leagues';
    const leagues = {
      39: 'Premier League',
      140: 'La Liga',
      135: 'Serie A',
      78: 'Bundesliga',
      61: 'Ligue 1',
      2: 'Champions League',
      3: 'Europa League'
    };
    return leagues[selectedLeague as keyof typeof leagues] || 'Selected League';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {matchType === 'live' && `Live Football Matches${selectedLeague === 0 ? '' : ` - ${getLeagueDisplayName()}`}`}
          {matchType === 'upcoming' && `Upcoming Football Matches${selectedLeague === 0 ? '' : ` - ${getLeagueDisplayName()}`}`}
          {matchType === 'all' && `Football Matches - ${getLeagueDisplayName()}`}
        </h1>
        <p className="text-gray-600">
          {matchType === 'live' && selectedLeague === 0 && 'Currently live matches from all leagues worldwide.'}
          {matchType === 'live' && selectedLeague !== 0 && `Currently live matches in ${getLeagueDisplayName()}.`}
          {matchType === 'upcoming' && selectedLeague === 0 && 'Upcoming matches from major leagues.'}
          {matchType === 'upcoming' && selectedLeague !== 0 && `Upcoming matches in ${getLeagueDisplayName()}.`}
          {matchType === 'all' && `Browse all matches in ${getLeagueDisplayName()}.`}
        </p>
      </div>

      {/* Match Type Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            onClick={() => handleMatchTypeChange('all')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              matchType === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => handleMatchTypeChange('live')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              matchType === 'live'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔴 Live Matches
          </button>
          <button
            onClick={() => handleMatchTypeChange('upcoming')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              matchType === 'upcoming'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Competition Selector and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${matchType} matches by team name...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Competition Selector with hybrid approach */}
        <CompetitionSelector
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
          className="md:w-48"
          showAllOption={matchType === 'live' || matchType === 'upcoming'}
          allOptionLabel={
            matchType === 'live' ? 'All Live Matches' :
            matchType === 'upcoming' ? 'All Upcoming Matches' :
            'All Leagues'
          }
        />
      </div>

      {/* Match count and info */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {matches.length} {matchType} {matches.length === 1 ? 'match' : 'matches'} found
          {selectedLeague === 0 && matchType === 'live' && (
            <span className="ml-2 text-blue-600 font-medium">from all leagues</span>
          )}
        </div>
        {matchType === 'live' && (
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Auto-refreshing every 30 seconds
          </div>
        )}
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
              {/* Your existing match card content */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">{match.competition}</p>
                <p className="text-xs text-gray-400">{new Date(match.match_date).toLocaleDateString()}</p>

                {match.status_short === 'LIVE' && (
                  <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 font-medium animate-pulse">
                    🔴 LIVE
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={match.home_team.logo}
                    alt={match.home_team.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="font-medium text-sm">{match.home_team.name}</span>
                </div>

                <div className="text-center px-2">
                  {match.score.home !== null && match.score.away !== null ? (
                    <span className="font-bold text-lg">
                      {match.score.home} - {match.score.away}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {matchType === 'live' ? 'LIVE' : new Date(match.match_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-medium text-sm">{match.away_team.name}</span>
                  <img
                    src={match.away_team.logo}
                    alt={match.away_team.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="text-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  match.status === 'Match Finished' ? 'bg-green-100 text-green-800' :
                  match.status === 'Not Started' ? 'bg-blue-100 text-blue-800' :
                  match.status_short === 'LIVE' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {match.status}
                </span>
              </div>

              {match.venue && (
                <div className="text-center mt-2">
                  <p className="text-xs text-gray-500">{match.venue}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {matchType === 'live' && selectedLeague === 0 && 'No live matches at the moment.'}
            {matchType === 'live' && selectedLeague !== 0 && `No live matches in ${getLeagueDisplayName()} at the moment.`}
            {matchType === 'upcoming' && 'No upcoming matches found.'}
            {matchType === 'all' && 'No matches found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;