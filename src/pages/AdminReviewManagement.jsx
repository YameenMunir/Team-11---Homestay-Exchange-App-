import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Search,
  Trash2,
  Eye,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  RefreshCw,
  Archive,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { reviewsService } from '../services/reviewsService';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const AdminReviewManagement = () => {
  const { hasPermission } = useAdmin();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [deletedReviews, setDeletedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'deleted'

  // Fetch all reviews on mount
  useEffect(() => {
    fetchReviews();
    fetchDeletedReviews();
  }, []);

  const fetchReviews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await reviewsService.getAllReviewsWithUserDetails();
      setReviews(data);
      if (isRefresh) {
        toast.success('Reviews refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchDeletedReviews = async () => {
    try {
      const data = await reviewsService.getDeletedReviews();
      setDeletedReviews(data);
    } catch (error) {
      console.error('Error fetching deleted reviews:', error);
    }
  };

  const handleRefresh = () => {
    fetchReviews(true);
    fetchDeletedReviews();
  };

  // Filter reviews based on search term and active tab
  const filteredReviews = reviews.filter((review) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      review.fullName?.toLowerCase().includes(searchLower) ||
      review.email?.toLowerCase().includes(searchLower) ||
      review.reviewText?.toLowerCase().includes(searchLower) ||
      review.phoneNumber?.toLowerCase().includes(searchLower)
    );
  });

  const filteredDeletedReviews = deletedReviews.filter((review) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      review.fullName?.toLowerCase().includes(searchLower) ||
      review.email?.toLowerCase().includes(searchLower) ||
      review.reviewText?.toLowerCase().includes(searchLower) ||
      review.phoneNumber?.toLowerCase().includes(searchLower)
    );
  });

  // Handle delete review
  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;

    try {
      setDeleting(true);
      // Track the deletion with user info before deleting
      await reviewsService.adminDeleteReviewWithTracking(selectedReview);

      // Immediately update the UI by removing from active reviews
      setReviews(prevReviews => prevReviews.filter(r => r.id !== selectedReview.id));

      toast.success('Review deleted successfully');
      setDeleteModalOpen(false);
      setSelectedReview(null);

      // Refresh deleted reviews list to show the newly deleted review
      await fetchDeletedReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
      // On error, refresh to get accurate state
      fetchReviews();
    } finally {
      setDeleting(false);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Calculate stats
  const stats = {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0,
    anonymousReviews: reviews.filter((r) => r.isAnonymous).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Review Management
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary flex items-center space-x-2"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          <p className="text-lg text-gray-600">
            View and manage all platform reviews
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'active'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('deleted')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'deleted'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span>Deleted Reviews ({deletedReviews.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.totalReviews}
                </span>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {stats.averageRating}
                  </span>
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Anonymous Reviews</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.anonymousReviews}
                </span>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or review text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {activeTab === 'active' ? (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Active Reviews ({filteredReviews.length})
            </h2>

            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? 'No reviews match your search' : 'No active reviews found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-teal-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <User className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="font-medium text-gray-900">
                              {review.isAnonymous ? (
                                <span className="flex items-center space-x-2">
                                  <span>Anonymous User</span>
                                  <Shield className="w-4 h-4 text-gray-500" />
                                </span>
                              ) : (
                                review.fullName || 'N/A'
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">
                              {review.email || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Phone Number</p>
                            <p className="font-medium text-gray-900">
                              {review.phoneNumber || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Submitted</p>
                            <p className="font-medium text-gray-900">
                              {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Rating</p>
                        {renderStars(review.rating)}
                      </div>

                      {/* Review Text */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Review</p>
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {review.reviewText}
                        </p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteClick(review)}
                      className="btn-outline text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 ml-4"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        ) : (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Deleted Reviews ({filteredDeletedReviews.length})
            </h2>

            {filteredDeletedReviews.length === 0 ? (
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? 'No deleted reviews match your search' : 'No deleted reviews found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeletedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-red-200 rounded-lg p-6 bg-red-50/30"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* User Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start space-x-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Full Name</p>
                              <p className="font-medium text-gray-900">
                                {review.isAnonymous ? (
                                  <span className="flex items-center space-x-2">
                                    <span>Anonymous User</span>
                                    <Shield className="w-4 h-4 text-gray-500" />
                                  </span>
                                ) : (
                                  review.fullName || 'N/A'
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium text-gray-900">
                                {review.email || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Phone Number</p>
                              <p className="font-medium text-gray-900">
                                {review.phoneNumber || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Deleted At</p>
                              <p className="font-medium text-gray-900">
                                {new Date(review.deletedAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Rating</p>
                          {renderStars(review.rating)}
                        </div>

                        {/* Review Text */}
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Review</p>
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {review.reviewText}
                          </p>
                        </div>
                      </div>

                      {/* Deleted Badge */}
                      <div className="ml-4">
                        <span className="badge bg-red-100 text-red-800">
                          Deleted
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedReview(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Review?"
        message={`Are you sure you want to delete this review? This action cannot be undone and will immediately remove the review from the public reviews page.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Review'}
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon={<Trash2 className="w-6 h-6 text-red-600" />}
      />
    </div>
  );
};

export default AdminReviewManagement;
