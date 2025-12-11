import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewsService } from '../services/reviewsService';
import ConfirmationModal from './ConfirmationModal';
import toast from 'react-hot-toast';
import {
  Star,
  Edit2,
  Trash2,
  X,
  Save,
  MessageCircle,
  Plus,
  Loader2,
} from 'lucide-react';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rating: 0,
    reviewText: '',
    isAnonymous: false,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [saving, setSaving] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    loadUserReviews();
  }, []);

  const loadUserReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsService.getUserReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading user reviews:', error);
      if (error.message !== 'User not authenticated') {
        toast.error('Failed to load your reviews');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditFormData({
      rating: review.rating,
      reviewText: review.reviewText,
      isAnonymous: review.isAnonymous,
    });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditFormData({
      rating: 0,
      reviewText: '',
      isAnonymous: false,
    });
    setHoveredRating(0);
  };

  const handleSaveEdit = async (reviewId) => {
    if (editFormData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!editFormData.reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSaving(true);

    try {
      await reviewsService.updateReview(reviewId, {
        rating: editFormData.rating,
        reviewText: editFormData.reviewText.trim(),
        isAnonymous: editFormData.isAnonymous,
      });

      toast.success('Review updated successfully!');
      setEditingReviewId(null);
      await loadUserReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error(error.message || 'Failed to update review');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await reviewsService.deleteReview(reviewToDelete);
      toast.success('Review deleted successfully');
      await loadUserReviews();
      setReviewToDelete(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStars = (count, interactive = false, onClick = null) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = interactive
        ? starValue <= (hoveredRating || editFormData.rating)
        : starValue <= count;

      return (
        <Star
          key={index}
          className={`w-5 h-5 transition-all ${
            interactive ? 'cursor-pointer hover:scale-110' : ''
          } ${isFilled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          onClick={() => {
            if (interactive && onClick) {
              onClick(starValue);
            }
          }}
          onMouseEnter={() => {
            if (interactive) {
              setHoveredRating(starValue);
            }
          }}
          onMouseLeave={() => {
            if (interactive) {
              setHoveredRating(0);
            }
          }}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Platform Reviews</h2>
            <p className="text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        <Link
          to="/reviews"
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
        </Link>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">You haven't submitted any reviews yet</p>
          <Link
            to="/reviews"
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isEditing = editingReviewId === review.id;

            return (
              <div
                key={review.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center space-x-2">
                        {renderStars(editFormData.rating, true, (rating) =>
                          setEditFormData({ ...editFormData, rating })
                        )}
                        <span className="ml-2 text-sm font-semibold text-gray-600">
                          {editFormData.rating} / 5
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Review
                      </label>
                      <textarea
                        value={editFormData.reviewText}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, reviewText: e.target.value })
                        }
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        placeholder="Share your experience..."
                      />
                    </div>

                    {/* Anonymous Checkbox */}
                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editFormData.isAnonymous}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, isAnonymous: e.target.checked })
                          }
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Post anonymously</span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={() => handleSaveEdit(review.id)}
                        disabled={saving}
                        className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    {/* Header with Stars and Actions */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating, false)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-3 italic">"{review.reviewText}"</p>

                    {/* Footer with Date and Anonymous Badge */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        Posted on {formatDate(review.createdAt)}
                      </span>
                      {review.isAnonymous && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                          Anonymous
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Link */}
      {reviews.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            to="/reviews"
            className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
          >
            View All Platform Reviews →
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setReviewToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default MyReviews;
