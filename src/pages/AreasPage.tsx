import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin,} from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { Area, areaService } from '../apis/getArea.api';

const AreasPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [continentFilter, setContinentFilter] = useState('');

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await areaService.getAreas(searchTerm);
        setAreas(data);
      } catch (err) {
        setError('Failed to fetch areas. Please try again later.');
        console.error('Error fetching areas:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchAreas();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Filter areas based on continent
  const filteredAreas = areas.filter(area => {
    return continentFilter ? area.continent === continentFilter : true;
  });

  // Get unique continents for filter
  const continents = [...new Set(areas.map(area => area.continent).filter(Boolean))];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Areas</h1>
        <p className="text-gray-600">Find matches and competitions by geographical areas.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for an area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {continents.length > 0 && (
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-48"
            value={continentFilter}
            onChange={(e) => setContinentFilter(e.target.value)}
          >
            <option value="">All Continents</option>
            {continents.map(continent => (
              <option key={continent} value={continent}>{continent}</option>
            ))}
          </select>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Areas Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAreas.map(area => (
            <Link
              key={area.id}
              to={`/areas/${area.id}`}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-36 overflow-hidden rounded-t-lg bg-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img
                  src={area.flag}
                  alt={`${area.name} flag`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <h3 className="text-white font-bold text-xl">{area.name}</h3>
                  <div className="flex items-center text-white/90 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{area.continent}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredAreas.length === 0 && !loading && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No areas found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default AreasPage;