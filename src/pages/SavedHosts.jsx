import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Star, Home, Users } from 'lucide-react';
import { savedHostsService } from '../services/savedHostsService';

const SavedHosts = () => {
  const navigate = useNavigate();
  const [savedHosts, setSavedHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedHosts();
  }, []);

  const fetchSavedHosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const hosts = await savedHostsService.getSavedHostsWithProfiles();
      setSavedHosts(hosts);
    } catch (err) {
      console.error('[SavedHosts] Error fetching saved hosts:', err);
      setError('Failed to load saved hosts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveHost = async (hostId, hostName) => {
    try {
      await savedHostsService.unsaveHost(hostId);
      setSavedHosts(savedHosts.filter(host => host.id !== hostId));
    } catch (err) {
      console.error('[SavedHosts] Error unsaving host:', err);
      alert('Failed to remove host from favorites. Please try again.');
    }
  };

  const handleViewProfile = (hostId) => {
    navigate(`/student/match/${hostId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your saved hosts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              Saved Hosts
            </h1>
            <p className="text-gray-600 mt-2">
              {savedHosts.length} {savedHosts.length === 1 ? 'host' : 'hosts'} saved for later
            </p>
          </div>
        </div>

        {/* Empty State */}
        {savedHosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Saved Hosts Yet</h2>
            <p className="text-gray-600 mb-6">
              Start exploring and save hosts you're interested in for easy access later.
            </p>
            <button
              onClick={() => navigate('/student/browse')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Hosts
            </button>
          </div>
        ) : (
          /* Saved Hosts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHosts.map((host) => (
              <div
                key={host.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Host Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-400">
                  {host.imageUrl ? (
                    <img
                      src={host.imageUrl}
                      alt={host.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  {/* Unsave Button */}
                  <button
                    onClick={() => handleUnsaveHost(host.id, host.name)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors group"
                    title="Remove from favorites"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
                  </button>
                  {/* Verified Badge */}
                  {host.verified && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Verified
                    </div>
                  )}
                </div>

                {/* Host Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{host.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{host.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  {host.rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-800">{host.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({host.reviewCount} {host.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  {/* Property Description */}
                  {host.propertyDescription && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {host.propertyDescription}
                    </p>
                  )}

                  {/* Rooms */}
                  {host.numberOfRooms && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Users className="w-4 h-4" />
                      <span>{host.numberOfRooms} {host.numberOfRooms === 1 ? 'room' : 'rooms'} available</span>
                    </div>
                  )}

                  {/* Amenities Preview */}
                  {host.amenities && host.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {host.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {host.amenities.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{host.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Saved Date */}
                  <p className="text-xs text-gray-400 mb-4">
                    Saved {new Date(host.savedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>

                  {/* View Profile Button */}
                  <button
                    onClick={() => handleViewProfile(host.id)}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedHosts;
