import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { reviewsService } from '../services/reviewsService';
import toast from 'react-hot-toast';
import {
  Star,
  Edit2,
  Trash2,
  Send,
  Loader2,
  MessageCircle,
  Award,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Home as HomeIcon,
} from 'lucide-react';

const Reviews = () => {
  const { user, loading: userLoading } = useUser();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Load reviews and average rating
  useEffect(() => {
    loadReviews();
    loadAverageRating();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewsService.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadAverageRating = async () => {
    try {
      const { average, count } = await reviewsService.getAverageRating();
      setAverageRating(average);
      setReviewCount(count);
    } catch (error) {
      console.error('Error loading average rating:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSubmitting(true);

    try {
      if (editingReviewId) {
        // Update existing review
        await reviewsService.updateReview(editingReviewId, {
          rating,
          reviewText: reviewText.trim(),
          isAnonymous,
        });
        toast.success('Review updated successfully!');
        setEditingReviewId(null);
      } else {
        // Create new review
        await reviewsService.createReview({
          rating,
          reviewText: reviewText.trim(),
          isAnonymous,
        });
        toast.success('Review submitted successfully!');
      }

      // Reset form
      setRating(0);
      setReviewText('');
      setIsAnonymous(false);

      // Reload reviews
      await loadReviews();
      await loadAverageRating();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setReviewText(review.reviewText);
    setIsAnonymous(review.isAnonymous);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(0);
    setReviewText('');
    setIsAnonymous(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewsService.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      await loadReviews();
      await loadAverageRating();
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

  const renderStars = (count, interactive = false, size = 'w-6 h-6') => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = interactive
        ? starValue <= (hoveredRating || rating)
        : starValue <= count;

      return (
        <Star
          key={index}
          className={`${size} transition-all cursor-pointer ${
            isFilled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          } ${interactive ? 'hover:scale-110' : ''}`}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHoveredRating(starValue)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
        />
      );
    });
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-orange-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      {/* Hero Section with Average Rating */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Back to Homepage Button */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-white hover:text-teal-100 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Homepage</span>
            </Link>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              <span>Community Feedback</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Platform Reviews
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-8">
              Read what our community has to say about Homestay Exchange
            </p>

            {/* Average Rating Display */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto border border-white border-opacity-20">
              <div className="flex items-center justify-center mb-4">
                {renderStars(Math.round(averageRating), false, 'w-8 h-8')}
              </div>
              <div className="text-6xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="text-teal-100 text-lg">
                Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Submission Form */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          {user ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-7 h-7 text-teal-600 mr-3" />
                {editingReviewId ? 'Edit Your Review' : 'Share Your Experience'}
              </h2>

              <form onSubmit={handleSubmitReview}>
                {/* Star Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {renderStars(rating, true, 'w-10 h-10')}
                    {rating > 0 && (
                      <span className="ml-4 text-lg font-semibold text-gray-700">
                        {rating} / 5
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your experience with Homestay Exchange..."
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum 10 characters required
                  </p>
                </div>

                {/* Anonymous Checkbox */}
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                      Post anonymously
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2 ml-8">
                    Your review will be displayed as "Anonymous User" but will be linked to your account
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={submitting || rating === 0 || !reviewText.trim()}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{editingReviewId ? 'Updating...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{editingReviewId ? 'Update Review' : 'Submit Review'}</span>
                      </>
                    )}
                  </button>

                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-teal-50 to-orange-50 rounded-2xl p-8 border border-teal-200 text-center">
              <MessageCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Want to share your experience?
              </h3>
              <p className="text-gray-600 mb-6">
                Please log in to submit a review
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link
                  to="/student/login"
                  className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                >
                  Student Login
                </Link>
                <Link
                  to="/host/login"
                  className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all"
                >
                  Host Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            All Reviews ({reviewCount})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No reviews yet</p>
              <p className="text-gray-400 mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review) => {
                const isOwner = user && review.userId === user.id;

                return (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                  >
                    {/* Header with Stars and Edit/Delete */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating, false, 'w-5 h-5')}
                      </div>

                      {isOwner && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit review"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "{review.reviewText}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="font-bold text-gray-900">{review.author}</div>
                        <div className="text-sm text-teal-600 capitalize">
                          {review.authorRole || 'User'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>

                    {/* Owner Badge */}
                    {isOwner && (
                      <div className="mt-4 inline-flex items-center space-x-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        <span>Your Review</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reviews;
