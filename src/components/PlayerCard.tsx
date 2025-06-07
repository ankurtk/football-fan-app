import React from 'react';
import { User, Calendar, MapPin, Award, Activity } from 'lucide-react';
import { Player } from '../apis/getPlayers.api';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Player Photo */}
        <div className="flex-shrink-0">
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=f3f4f6&color=6b7280`;
              }}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{player.name}</h3>
          <p className="text-blue-600 font-medium">{player.statistics.position}</p>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{player.age} years old</span>
            </div>
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              <span>{player.nationality}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-3 flex gap-4 text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-600">{player.statistics.appearances}</div>
              <div className="text-gray-500">Apps</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{player.statistics.goals.total}</div>
              <div className="text-gray-500">Goals</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">{player.statistics.goals.assists}</div>
              <div className="text-gray-500">Assists</div>
            </div>
            {player.statistics.rating && (
              <div className="text-center">
                <div className="font-semibold text-orange-600">{parseFloat(player.statistics.rating).toFixed(1)}</div>
                <div className="text-gray-500">Rating</div>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-col items-end gap-2">
          {player.injured && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Injured
            </span>
          )}
          {player.statistics.captain && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Captain
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;