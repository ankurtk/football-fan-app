import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useMatches } from '../../hooks/useMatches';
import Spinner from '../ui/Spinner';

const FeaturedMatches: React.FC = () => {
  // Change activeTab to only have 'upcoming' and 'live' options
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live'>('upcoming');

  // Use the updated hook with manual refresh capability
  const { matches, loading, error, lastFetched, refetch } = useMatches({
    type: activeTab
  });

  // Sort matches by date for better display
  const sortedMatches = matches
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
    .slice(0, 6); // Limit to 6 matches for featured section

  const handleRefresh = () => {
    refetch();
  };

  if (loading && !lastFetched) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !lastFetched) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header with Tabs and Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        {/* Tabs for filtering - Remove Today's Matches tab */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'live'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('live')}
          >
            Live Matches
          </button>
        </div>

        {/* Refresh Button */}
        <div className="flex items-center gap-3">
          {lastFetched && (
            <span className="text-xs text-gray-500">
              Last updated: {format(lastFetched, 'HH:mm:ss')}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-200 ${
              loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
            }`}
            title="Refresh matches"
          >
            <RefreshCw
              size={16}
              className={`${loading ? 'animate-spin' : ''} transition-transform`}
            />
            <span className="text-sm font-medium">
              {loading ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
      </div>

      {/* Error Display (if there's an error but we have cached data) */}
      {error && lastFetched && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <span>Failed to refresh data. Showing last cached results.</span>
            <button
              onClick={handleRefresh}
              className="text-yellow-800 hover:text-yellow-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Time Display - Update text */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Clock size={16} className="mr-1" />
        <span>
          {activeTab === 'upcoming' && 'Upcoming matches in the next 2 weeks'}
          {activeTab === 'live' && 'Currently live matches'}
        </span>
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedMatches.length > 0 ? (
          sortedMatches.map(match => (
            <div
              key={match.id}
              className="group bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 p-4 hover:-translate-y-1"
            >
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 mb-2">
                  {match.competition}
                </span>

                {/* Live indicator */}
                {match.status_short === 'LIVE' && (
                  <span className="inline-block ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 font-medium animate-pulse">
                    🔴 LIVE
                  </span>
                )}

                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} className="group-hover:text-blue-500 transition-colors" />
                  <span>{match.venue}</span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {/* Always show full date since we removed today tab */}
                  {format(new Date(match.match_date), 'MMM d, HH:mm')}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center mb-1">
                    {match.home_team.logo && (
                      <img
                        src={match.home_team.logo}
                        alt={match.home_team.name}
                        className="w-6 h-6 object-contain mr-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <p className="font-semibold text-sm">{match.home_team.name}</p>
                  </div>
                </div>

                <div className="mx-4 text-center">
                  {match.score.home !== null && match.score.away !== null ? (
                    <div className="font-bold text-lg">
                      {match.score.home} - {match.score.away}
                    </div>
                  ) : (
                    <div className="text-gray-500 font-medium">vs</div>
                  )}
                </div>

                <div className="text-center flex-1">
                  <div className="flex items-center justify-center mb-1">
                    <p className="font-semibold text-sm">{match.away_team.name}</p>
                    {match.away_team.logo && (
                      <img
                        src={match.away_team.logo}
                        alt={match.away_team.name}
                        className="w-6 h-6 object-contain ml-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Match Status */}
              <div className="text-center mt-3">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  match.status_short === 'FT' ? 'bg-green-100 text-green-800' :
                  match.status_short === 'NS' ? 'bg-blue-100 text-blue-800' :
                  match.status_short === 'LIVE' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {match.status_short === 'NS' ? 'Upcoming' :
                   match.status_short === 'FT' ? 'Finished' :
                   match.status_short === 'LIVE' ? 'Live' :
                   match.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {activeTab === 'upcoming' && 'No upcoming matches found.'}
            {activeTab === 'live' && 'No live matches at the moment.'}
          </div>
        )}
      </div>

      {/* View All Link - Update text */}
      {sortedMatches.length > 0 && (
        <div className="text-center mt-6">
          <Link
            to={`/matches?type=${activeTab}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            {activeTab === 'upcoming' && 'View all upcoming matches'}
            {activeTab === 'live' && 'View all live matches'}
            <span className="ml-1">→</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedMatches;