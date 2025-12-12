import supabase from '../utils/supabase';

/**
 * Service for platform reviews operations
 */
export const reviewsService = {
  // Expose supabase for direct auth access
  supabase,

  /**
   * Create a new platform review
   * @param {Object} reviewData - Review information
   * @returns {Promise} Created review data
   */
  async createReview(reviewData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('platform_reviews')
      .insert([
        {
          user_id: user.id,
          rating: reviewData.rating,
          review_text: reviewData.reviewText,
          is_anonymous: reviewData.isAnonymous || false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all platform reviews with user information
   * @returns {Promise} Array of reviews
   */
  async getAllReviews() {
    const { data, error } = await supabase
      .from('platform_reviews')
      .select(`
        id,
        user_id,
        rating,
        review_text,
        is_anonymous,
        created_at,
        updated_at,
        user_profiles!user_id (
          full_name,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format the response to handle anonymous reviews
    return data.map(review => ({
      id: review.id,
      userId: review.user_id,
      rating: review.rating,
      reviewText: review.review_text,
      isAnonymous: review.is_anonymous,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      author: review.is_anonymous ? 'Anonymous User' : review.user_profiles?.full_name || 'Unknown User',
      authorRole: review.user_profiles?.role || null,
    }));
  },

  /**
   * Get current user's reviews
   * @returns {Promise} Array of user's reviews
   */
  async getUserReviews() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('platform_reviews')
      .select(`
        id,
        user_id,
        rating,
        review_text,
        is_anonymous,
        created_at,
        updated_at,
        user_profiles!user_id (
          full_name,
          role
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format the response
    return data.map(review => ({
      id: review.id,
      userId: review.user_id,
      rating: review.rating,
      reviewText: review.review_text,
      isAnonymous: review.is_anonymous,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      author: review.is_anonymous ? 'Anonymous User' : review.user_profiles?.full_name || 'Unknown User',
      authorRole: review.user_profiles?.role || null,
    }));
  },

  /**
   * Get a single review by ID
   * @param {string} reviewId - Review ID
   * @returns {Promise} Review data
   */
  async getReviewById(reviewId) {
    const { data, error } = await supabase
      .from('platform_reviews')
      .select(`
        id,
        user_id,
        rating,
        review_text,
        is_anonymous,
        created_at,
        updated_at,
        user_profiles!user_id (
          full_name,
          role
        )
      `)
      .eq('id', reviewId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      rating: data.rating,
      reviewText: data.review_text,
      isAnonymous: data.is_anonymous,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      author: data.is_anonymous ? 'Anonymous User' : data.user_profiles?.full_name || 'Unknown User',
      authorRole: data.user_profiles?.role || null,
    };
  },

  /**
   * Update an existing review
   * @param {string} reviewId - Review ID
   * @param {Object} updates - Updated review data
   * @returns {Promise} Updated review data
   */
  async updateReview(reviewId, updates) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify user owns this review
    const { data: existingReview, error: fetchError } = await supabase
      .from('platform_reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (fetchError) throw fetchError;

    if (existingReview.user_id !== user.id) {
      throw new Error('You can only edit your own reviews');
    }

    const updateData = {};
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.reviewText !== undefined) updateData.review_text = updates.reviewText;
    if (updates.isAnonymous !== undefined) updateData.is_anonymous = updates.isAnonymous;

    const { data, error } = await supabase
      .from('platform_reviews')
      .update(updateData)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @returns {Promise} Success status
   */
  async deleteReview(reviewId) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify user owns this review
    const { data: existingReview, error: fetchError } = await supabase
      .from('platform_reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (fetchError) throw fetchError;

    if (existingReview.user_id !== user.id) {
      throw new Error('You can only delete your own reviews');
    }

    const { error } = await supabase
      .from('platform_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Get average rating for the platform
   * @returns {Promise} Average rating and count
   */
  async getAverageRating() {
    const { data, error } = await supabase
      .from('platform_reviews')
      .select('rating');

    if (error) throw error;

    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = data.reduce((sum, review) => sum + review.rating, 0);
    const average = total / data.length;

    return {
      average: Number(average.toFixed(1)),
      count: data.length,
    };
  },

  /**
   * Check if current user can edit a specific review
   * @param {string} reviewId - Review ID
   * @returns {Promise<boolean>} Whether user can edit
   */
  async canUserEdit(reviewId) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('platform_reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (error || !data) return false;

    return data.user_id === user.id;
  },

  /**
   * Get all platform reviews with full user details (Admin only)
   * Includes user's full name, email, and phone number
   * @returns {Promise} Array of reviews with complete user information
   */
  async getAllReviewsWithUserDetails() {
    const { data, error } = await supabase
      .from('platform_reviews')
      .select(`
        id,
        user_id,
        rating,
        review_text,
        is_anonymous,
        created_at,
        updated_at,
        user_profiles!user_id (
          full_name,
          email,
          phone_number,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format the response with full user details
    return data.map(review => ({
      id: review.id,
      userId: review.user_id,
      rating: review.rating,
      reviewText: review.review_text,
      isAnonymous: review.is_anonymous,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      fullName: review.user_profiles?.full_name || 'Unknown User',
      email: review.user_profiles?.email || 'N/A',
      phoneNumber: review.user_profiles?.phone_number || 'N/A',
      authorRole: review.user_profiles?.role || null,
    }));
  },

  /**
   * Delete any review (Admin only)
   * Does not check ownership - admins can delete any review
   * @param {string} reviewId - Review ID
   * @returns {Promise} Success status
   */
  async adminDeleteReview(reviewId) {
    const { error } = await supabase
      .from('platform_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
    return { success: true };
  },
};
