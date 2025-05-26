import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useMatches} from '../../hooks/useMatches';
import Spinner from '../ui/Spinner';

const FeaturedMatches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');
  const { matches, loading, error } = useMatches();

  const filteredMatches = matches.filter(match => {
    const matchDate = new Date(match.match_date);
    const today = new Date();

    if (activeTab === 'today') {
      return format(matchDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    }
    return matchDate > today;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Tabs for filtering */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'today'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('today')}
        >
          Today
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
      </div>

      {/* Time Display */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Clock size={16} className="mr-1" />
        <span>Showing matches for {format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <Link
              key={match.id}
              to={`/matches/${match.id}`}
              className="group bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 p-4 hover:-translate-y-1"
            >
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 mb-2">
                  {match.competition}
                </span>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} className="group-hover:text-blue-500 transition-colors" />
                  <span>{match.home_team.venue}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(match.match_date), 'HH:mm')}
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
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No matches found for {activeTab === 'today' ? 'today' : 'upcoming dates'}.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedMatches;