import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FolderRoot as Football } from 'lucide-react';
import { cn } from '../../utils/cn';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/matches', label: 'Matches' },
    { path: '/teams', label: 'Teams' },
    { path: '/players', label: 'Players' },
    // { path: '/areas', label: 'Areas' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Football className="h-8 w-8" />
            <span className="text-xl font-bold">Football Explorer</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "hover:text-blue-200 transition-colors duration-200",
                  location.pathname === item.path ? "font-semibold text-white border-b-2 border-white pb-1" : ""
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Add Areas as disabled/under construction */}
            <span className="text-blue-300 cursor-not-allowed relative group">
              Areas
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Under Construction
              </span>
            </span>
          </div>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 pb-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block py-2 px-4 hover:bg-blue-800 rounded",
                  location.pathname === item.path ? "bg-blue-800 font-medium" : ""
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile under construction item */}
            <div className="py-2 px-4 text-blue-300 cursor-not-allowed">
              Areas (Under Construction)
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;