import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Calendar,
  Star,
  CheckCircle,
  Heart,
  Briefcase,
} from 'lucide-react';

const BrowseTasks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState('all');

  // Mock tasks data
  const tasks = [
    {
      id: 1,
      hostId: 1,
      hostName: 'Margaret Thompson',
      hostAge: 68,
      hostLocation: 'Kensington, London',
      hostRating: 4.8,
      hostVerified: true,
      hostImage: 'https://randomuser.me/api/portraits/women/67.jpg',
      title: 'Weekly Grocery Shopping & Companionship',
      description: 'I need help with weekly grocery shopping at Tesco (15-20 minutes walk). Would also love some company for tea and conversation afterwards.',
      services: ['Grocery Shopping', 'Companionship'],
      hoursPerWeek: '3-4 hours',
      frequency: 'Weekly',
      schedule: 'Flexible, preferably weekday afternoons',
      compensation: 'Private room with ensuite bathroom',
      postedDate: '2025-01-18',
      applicants: 3,
    },
    {
      id: 2,
      hostId: 2,
      hostName: 'Robert Davies',
      hostAge: 72,
      hostLocation: 'Camden, London',
      hostRating: 4.6,
      hostVerified: true,
      hostImage: 'https://randomuser.me/api/portraits/men/45.jpg',
      title: 'Technology Help & Light Cleaning',
      description: 'Looking for someone to help me with my computer and smartphone (emails, video calls). Also need help with light dusting and vacuuming once a week.',
      services: ['Technology Help', 'Light Cleaning'],
      hoursPerWeek: '4-5 hours',
      frequency: 'Twice a week',
      schedule: 'Tuesday and Friday evenings',
      compensation: 'Private room with shared bathroom, WiFi included',
      postedDate: '2025-01-20',
      applicants: 5,
    },
    {
      id: 3,
      hostId: 3,
      hostName: 'Elizabeth Brown',
      hostAge: 65,
      hostLocation: 'Westminster, London',
      hostRating: 4.9,
      hostVerified: true,
      hostImage: 'https://randomuser.me/api/portraits/women/55.jpg',
      title: 'Garden Maintenance & Meal Preparation',
      description: 'I have a small garden that needs regular weeding and watering. Would also appreciate help preparing simple dinners a few times a week.',
      services: ['Garden Help', 'Meal Preparation'],
      hoursPerWeek: '5-6 hours',
      frequency: 'Weekly',
      schedule: 'Weekends preferred',
      compensation: 'Private room with ensuite, garden view, meals included',
      postedDate: '2025-01-22',
      applicants: 2,
    },
  ];

  const serviceOptions = [
    'Companionship',
    'Grocery Shopping',
    'Light Cleaning',
    'Meal Preparation',
    'Garden Help',
    'Technology Help',
    'Pet Care',
  ];

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.hostLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesServices =
      selectedServices.length === 0 ||
      selectedServices.some((service) => task.services.includes(service));

    const matchesFrequency =
      selectedFrequency === 'all' || task.frequency.toLowerCase().includes(selectedFrequency);

    return matchesSearch && matchesServices && matchesFrequency;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Browse Available Tasks
          </h1>
          <p className="text-lg text-gray-600">
            Find tasks posted by hosts looking for help. Apply to tasks that match your skills and availability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              {/* Services Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Services</h3>
                <div className="space-y-2">
                  {serviceOptions.map((service) => (
                    <label key={service} className="flex items-center space-x-2 cursor-pointer">
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
              </div>

              {/* Frequency Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Frequency</h3>
                <select
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="all">All Frequencies</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="twice">Twice a week</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedServices.length > 0 || selectedFrequency !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedServices([]);
                    setSelectedFrequency('all');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tasks or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12 w-full"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredTasks.length}</span> available tasks
              </p>
            </div>

            {/* Tasks Grid */}
            <div className="space-y-6">
              {filteredTasks.length === 0 ? (
                <div className="card p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedServices([]);
                      setSelectedFrequency('all');
                    }}
                    className="btn-secondary"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Host Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200">
                          <img
                            src={task.hostImage}
                            alt={task.hostName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {task.title}
                              </h3>
                              {task.hostVerified && (
                                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Posted by {task.hostName}, {task.hostAge}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{task.hostLocation}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{task.hostRating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-4">
                          {task.description}
                        </p>

                        {/* Services Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {task.services.map((service) => (
                            <span
                              key={service}
                              className="badge bg-purple-100 text-purple-800"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Task Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span>{task.hoursPerWeek}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>{task.frequency}</span>
                          </div>
                          <div className="text-sm text-gray-600 col-span-2">
                            <span className="font-medium">Schedule:</span> {task.schedule}
                          </div>
                        </div>

                        {/* Compensation */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-900">
                            <span className="font-semibold">Compensation:</span> {task.compensation}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            {task.applicants} applicants • Posted {new Date(task.postedDate).toLocaleDateString('en-GB')}
                          </p>
                          <Link
                            to={`/student/apply/${task.id}`}
                            className="btn-primary"
                          >
                            Apply to Task
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseTasks;
