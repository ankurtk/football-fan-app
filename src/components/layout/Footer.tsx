import React from 'react';
import { Link } from 'react-router-dom';
import { FolderRoot as Football, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Football className="h-6 w-6" />
              <span className="text-lg font-bold">Football Explorer</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your go-to platform for football matches, teams, and player information.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/ankurtk/football-fan-app" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/matches" className="text-gray-400 hover:text-white transition-colors duration-200">Matches</Link></li>
              <li><Link to="/teams" className="text-gray-400 hover:text-white transition-colors duration-200">Teams</Link></li>
              <li><Link to="/players" className="text-gray-400 hover:text-white transition-colors duration-200">Players</Link></li>
              <li><span className="text-gray-500 cursor-not-allowed">Areas (Coming Soon)</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Football Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;