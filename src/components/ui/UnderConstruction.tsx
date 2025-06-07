import React from 'react';
import { Construction, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UnderConstructionProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  estimatedCompletion?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title = "Under Construction",
  message = "This feature is currently being developed and will be available soon.",
  showBackButton = true,
  estimatedCompletion
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Construction Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Construction size={80} className="text-yellow-500 animate-bounce" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        {/* Estimated Completion */}
        {estimatedCompletion && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-blue-700">
              <Calendar size={18} className="mr-2" />
              <span className="font-medium">Expected: {estimatedCompletion}</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Development Progress</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full w-1/4 animate-pulse"></div>
          </div>
        </div>

        {/* Features Coming Soon */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Coming Soon:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Browse football areas by region</li>
            <li>• View teams and matches by location</li>
            <li>• Interactive maps and statistics</li>
            <li>• Area-specific competitions</li>
          </ul>
        </div>

        {/* Back Button */}
        {showBackButton && (
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        )}

        {/* Additional Info */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Want to be notified when this feature is ready?</p>
          <p className="mt-1">Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;