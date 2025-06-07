import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Map} from 'lucide-react';
import FeaturedMatches from '../components/matches/FeaturedMatches';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative">
        <div className="bg-blue-600 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-blue-600/30 z-10"></div>
          <img
            src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
            alt="Football stadium"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-start p-8 md:p-16">
            <div className="max-w-xl text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover the World of Football</h1>
              <p className="text-lg md:text-xl mb-6 text-blue-100">
                Stay updated with the latest matches, teams, and player statistics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/matches" className="btn btn-primary bg-white text-blue-600 hover:bg-blue-50">
                  Browse Matches
                </Link>
                <Link to="/teams" className="btn border-2 border-white text-white hover:bg-white/10">
                  Explore Teams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Matches Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Matches</h2>
          <Link to="/matches" className="text-blue-600 hover:text-blue-800 flex items-center">
            View all matches <span className="ml-1">→</span>
          </Link>
        </div>
        <FeaturedMatches />
      </section>

      {/* Explore Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/matches" className="card group p-6 hover:shadow-lg transition-all duration-300">
          <div className="mb-4 bg-blue-100 text-blue-600 p-3 rounded-full w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Calendar size={24} />
          </div>
          <h3 className="text-lg font-semibold">Matches</h3>
          <p className="text-gray-600 mt-2">Browse upcoming and past matches with live scores.</p>
        </Link>

        <Link to="/teams" className="card group p-6 hover:shadow-lg transition-all duration-300">
          <div className="mb-4 bg-green-100 text-green-600 p-3 rounded-full w-fit group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold">Teams</h3>
          <p className="text-gray-600 mt-2">Discover teams and their roster information.</p>
        </Link>

        <Link to="/players" className="card group p-6 hover:shadow-lg transition-all duration-300">
          <div className="mb-4 bg-purple-100 text-purple-600 p-3 rounded-full w-fit group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold">Players</h3>
          <p className="text-gray-600 mt-2">Explore player profiles and statistics.</p>
        </Link>

        {/* Replace Areas card with Under Construction */}
        <div className="card p-6 bg-gray-50 border-dashed border-2 border-gray-300">
          <div className="mb-4 bg-yellow-100 text-yellow-600 p-3 rounded-full w-fit">
            <Map size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-600">Areas</h3>
          <p className="text-gray-500 mt-2">Coming soon - Browse teams and matches by location.</p>
          <div className="mt-4">
            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              Under Construction
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;