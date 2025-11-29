import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContextNew';
import { MapPin, Home, Star, MessageSquare } from 'lucide-react';

export default function BrowseHosts() {
  const { user } = useAuth();
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ city: '', postcode: '' });

  useEffect(() => {
    fetchHosts();
  }, []);

  const fetchHosts = async () => {
    try {
      let query = supabase
        .from('host_profiles')
        .select(
          `
          *,
          user_profiles!inner(
            id,
            full_name,
            email,
            is_verified
          )
        `
        )
        .eq('user_profiles.is_verified', true)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setHosts(data || []);
    } catch (error) {
      console.error('Error fetching hosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacilitate = async (hostUserId, hostName) => {
    const confirmed = window.confirm(
      `Send a facilitation request to ${hostName}? An admin will review and coordinate the match.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase.from('facilitation_requests').insert([
        {
          requester_id: user.id,
          target_id: hostUserId,
          requester_role: 'guest',
          message: 'I would like to connect with this host.',
        },
      ]);

      if (error) throw error;
      alert('Facilitation request sent! Admin will review it shortly.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending request: ' + error.message);
    }
  };

  const filteredHosts = hosts.filter((host) => {
    if (filter.city && !host.city.toLowerCase().includes(filter.city.toLowerCase())) {
      return false;
    }
    if (filter.postcode && !host.postcode.toLowerCase().includes(filter.postcode.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Hosts</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="Filter by city"
              value={filter.city}
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
            <input
              type="text"
              placeholder="Filter by postcode"
              value={filter.postcode}
              onChange={(e) => setFilter({ ...filter, postcode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Showing {filteredHosts.length} verified host{filteredHosts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Host Cards */}
      {filteredHosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hosts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHosts.map((host) => (
            <div
              key={host.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Host Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {host.user_profiles.full_name}
                </h3>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {host.city}, {host.postcode}
                  </span>
                </div>

                {host.average_rating > 0 && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="text-sm font-medium">
                      {host.average_rating.toFixed(1)} ({host.total_ratings} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="mb-4 space-y-2 text-sm text-gray-700">
                {host.number_of_rooms && (
                  <p>
                    <span className="font-medium">Rooms:</span> {host.number_of_rooms}
                  </p>
                )}
                {host.property_description && (
                  <p className="text-gray-600 line-clamp-3">{host.property_description}</p>
                )}
                {host.amenities && host.amenities.length > 0 && (
                  <div>
                    <span className="font-medium">Amenities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {host.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {host.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                          +{host.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Facilitate Button */}
              <button
                onClick={() => handleFacilitate(host.user_id, host.user_profiles.full_name)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Facilitate Match
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
