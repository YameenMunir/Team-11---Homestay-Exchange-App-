import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Home,
  Users,
  Filter,
  X,
  CheckCircle,
  Heart,
  Loader2,
  ArrowLeft,
  Briefcase,
  Clock,
  Calendar,
  DollarSign,
  Bed,
  Sparkles,
} from 'lucide-react';
import { hostService } from '../services/hostService';

const BrowseHosts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [savedHosts, setSavedHosts] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const servicesOptions = [
    'Companionship',
    'Light Cleaning',
    'Grocery Shopping',
    'Meal Preparation',
    'Garden Help',
    'Pet Care',
    'Technology Help',
  ];

  // Fetch hosts from database
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching verified hosts with tasks...');
        const data = await hostService.getVerifiedHostsWithTasks();
        console.log('Received hosts data:', data);
        console.log('Number of hosts:', data?.length || 0);
        setHosts(data);
      } catch (err) {
        console.error('Error fetching hosts:', err);
        console.error('Error details:', err.message);
        setError(`Failed to load hosts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHosts();
  }, []);

  const toggleService = (service) => {
    setSelectedServices(
      selectedServices.includes(service)
        ? selectedServices.filter((s) => s !== service)
        : [...selectedServices, service]
    );
  };

  const toggleSaveHost = (hostId) => {
    setSavedHosts(
      savedHosts.includes(hostId)
        ? savedHosts.filter((id) => id !== hostId)
        : [...savedHosts, hostId]
    );
  };

  const filteredHosts = hosts.filter((host) => {
    const matchesSearch =
      host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesServices =
      selectedServices.length === 0 ||
      selectedServices.some((service) => host.servicesNeeded.includes(service));

    return matchesSearch && matchesServices;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Browse Hosts
          </h1>
          <p className="text-lg text-gray-600">
            Find the perfect match for your accommodation needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Filters</h3>

              {/* Services Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Services Needed
                </label>
                <div className="space-y-2">
                  {servicesOptions.map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {service}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {selectedServices.length > 0 && (
                <button
                  onClick={() => setSelectedServices([])}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search & Mobile Filter Toggle */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or location..."
                  className="input-field pl-11 w-full"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary flex items-center justify-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden card p-6 mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {servicesOptions.map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedServices([]);
                      setShowFilters(false);
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="card p-6 bg-red-50 border-red-200 mb-6">
                <p className="text-red-800 text-center">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="card p-12 text-center">
                <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Loading hosts...
                </h3>
                <p className="text-gray-600">
                  Please wait while we find available hosts for you.
                </p>
              </div>
            )}

            {/* Results Count */}
            {!loading && !error && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredHosts.length}</span>{' '}
                  {filteredHosts.length === 1 ? 'host' : 'hosts'}
                  {selectedServices.length > 0 &&
                    ` matching ${selectedServices.length} ${
                      selectedServices.length === 1 ? 'filter' : 'filters'
                    }`}
                </p>
              </div>
            )}

            {/* Host Cards */}
            {!loading && !error && (
              <div className="space-y-6">
              {filteredHosts.map((host) => (
                <div
                  key={host.id}
                  className="card p-0 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Host Image Section */}
                    <div className="lg:w-64 flex-shrink-0 relative">
                      <div className="h-64 lg:h-full w-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center relative">
                        {host.imageUrl ? (
                          <img
                            src={host.imageUrl}
                            alt={host.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-24 h-24 text-purple-400" />
                        )}
                        <button
                          onClick={() => toggleSaveHost(host.id)}
                          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                          aria-label="Save host"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              savedHosts.includes(host.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Host Details Section */}
                    <div className="flex-1 p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {host.name}
                            </h3>
                            {host.verified && (
                              <CheckCircle className="w-6 h-6 text-purple-600" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">{host.location}</span>
                          </div>

                          {host.numberOfRooms && (
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4 text-purple-600" />
                              <span>{host.numberOfRooms} {host.numberOfRooms === 1 ? 'room' : 'rooms'}</span>
                            </div>
                          )}

                          {/* Rating */}
                          {host.reviewCount > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900">
                                {host.rating.toFixed(1)}
                              </span>
                              <span className="text-gray-500">
                                ({host.reviewCount} {host.reviewCount === 1 ? 'review' : 'reviews'})
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">New host</span>
                          )}
                        </div>
                      </div>

                      {/* Property Description */}
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {host.propertyDescription}
                      </p>

                      {/* Amenities */}
                      {host.amenities && host.amenities.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-900">Amenities:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {host.amenities.slice(0, 5).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                              >
                                {amenity}
                              </span>
                            ))}
                            {host.amenities.length > 5 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{host.amenities.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Available Tasks */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            Available Opportunities ({host.tasks?.length || 0})
                          </span>
                        </div>

                        <div className="space-y-3">
                          {host.tasks?.slice(0, 2).map((task) => (
                            <div key={task.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>

                              {/* Task Details */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{task.hoursPerWeek} hrs/week</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{task.frequency}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  <span className="font-medium text-green-700">Duration: {task.duration}</span>
                                </div>
                              </div>

                              {/* Services for this task */}
                              <div className="flex flex-wrap gap-1">
                                {task.servicesNeeded.slice(0, 3).map((service, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                                  >
                                    {service}
                                  </span>
                                ))}
                                {task.servicesNeeded.length > 3 && (
                                  <span className="text-xs text-gray-500 px-2">
                                    +{task.servicesNeeded.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}

                          {host.tasks && host.tasks.length > 2 && (
                            <p className="text-xs text-gray-500 italic">
                              +{host.tasks.length - 2} more {host.tasks.length - 2 === 1 ? 'opportunity' : 'opportunities'} available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* All Services Summary */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          All Services Needed:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {host.allServicesNeeded?.map((service, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Preferences */}
                      {(host.preferredGender || host.preferredAgeRange) && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Preferences:</p>
                          <div className="flex flex-wrap gap-3 text-xs text-blue-800">
                            {host.preferredGender && (
                              <span>Gender: {host.preferredGender}</span>
                            )}
                            {host.preferredAgeRange && (
                              <span>Age: {host.preferredAgeRange}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* View Profile Button */}
                      <div className="flex gap-3 pt-2">
                        <Link
                          to={`/student/match/${host.id}`}
                          className="btn-primary flex items-center justify-center gap-2 flex-1"
                        >
                          <Users className="w-4 h-4" />
                          View Full Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* No Results */}
              {filteredHosts.length === 0 && (
                <div className="card p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {hosts.length === 0 ? 'No hosts available yet' : 'No hosts found'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {hosts.length === 0
                      ? 'There are currently no verified hosts with active tasks. Please check back later.'
                      : 'Try adjusting your search or filters to find more matches.'}
                  </p>
                  {hosts.length > 0 && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedServices([]);
                      }}
                      className="btn-primary"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseHosts;
