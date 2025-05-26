import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { areaService } from '../apis/getArea.api';
import * as flags from 'country-flag-icons/react/3x2';

interface AreaDetail {
  id: number;
  name: string;
  country_code: string;
}

const getCountryFlag = (countryCode: string) => {
  const countryMapping: { [key: string]: keyof typeof flags } = {
    'ENG': 'GB',
    'ESP': 'ES',
    'GER': 'DE',
    'FRA': 'FR',
    'ITA': 'IT',
    'NED': 'NL',
    'POR': 'PT',
    'BRA': 'BR',
    'ARG': 'AR',
    'BEL': 'BE'
  };

  const flagCode = countryMapping[countryCode];
  if (flagCode && flags[flagCode]) {
    const FlagComponent = flags[flagCode];
    return <FlagComponent />;
  }
  return null;
};

const AreaDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [area, setArea] = useState<AreaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreaDetail = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAreaById(Number(id));
        setArea(response.data);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch area details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaDetail();
  }, [id]);

  const handleViewTeams = () => {
  navigate('/teams', {
    state: { area: area?.name }
  });
};

  const handleViewPlayers = () => {
  navigate('/players', {
    state: { nationality: area?.name }
  });
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !area) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error || 'Area not found'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Hero Section with Flag */}
        <div className="relative h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <div className="w-full h-full">
            {getCountryFlag(area.country_code) && (
              <div className="w-full h-full">
                {React.cloneElement(getCountryFlag(area.country_code) as React.ReactElement, {
                  className: 'w-full h-full object-cover'
                })}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 p-6 z-20">
            <h1 className="text-4xl font-bold text-white mb-2">{area.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin size={16} className="mr-2" />
              <span>{area.country_code}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Teams Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Teams</h2>
              <p className="text-gray-600">View teams from {area.name}</p>
              <button onClick={handleViewTeams} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                View Teams
              </button>
            </div>

            {/* Players Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Players</h2>
              <p className="text-gray-600">Players from {area.name}</p>
              <button onClick={handleViewPlayers} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                View Players
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetailPage;