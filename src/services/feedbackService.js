import { supabase } from '../lib/supabaseClient';

/**
 * Monthly Feedback Service
 * Handles submission and retrieval of monthly feedback between hosts and students
 */

/**
 * Get current month in YYYY-MM format
 */
export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Submit monthly feedback
 * @param {Object} feedbackData - Feedback data
 * @param {string} feedbackData.facilitation_id - Facilitation request ID
 * @param {string} feedbackData.recipient_id - User receiving the feedback
 * @param {number} feedbackData.rating - Rating (1-5)
 * @param {string} feedbackData.feedback_text - Feedback text
 * @param {number} feedbackData.hours_contributed - Hours contributed (optional)
 * @param {string} feedbackData.tasks_completed - Tasks completed (optional)
 * @param {string} feedbackData.highlights - Highlights (optional)
 * @param {string} feedbackData.challenges - Challenges (optional)
 * @param {string} feedbackData.goals_next_month - Goals for next month (optional)
 * @param {boolean} feedbackData.support_needed - Support needed flag (optional)
 * @param {string} feedbackData.support_details - Support details (optional)
 * @param {string} feedbackData.feedback_month - Month in YYYY-MM format (defaults to current month)
 */
export const submitMonthlyFeedback = async (feedbackData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user role
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Prepare feedback data
    const feedback = {
      facilitation_id: feedbackData.facilitation_id,
      submitter_id: user.id,
      recipient_id: feedbackData.recipient_id,
      submitter_role: userProfile.role,
      rating: feedbackData.rating,
      feedback_text: feedbackData.feedback_text,
      hours_contributed: feedbackData.hours_contributed || null,
      tasks_completed: feedbackData.tasks_completed || null,
      highlights: feedbackData.highlights || null,
      challenges: feedbackData.challenges || null,
      goals_next_month: feedbackData.goals_next_month || null,
      support_needed: feedbackData.support_needed || false,
      support_details: feedbackData.support_details || null,
      feedback_month: feedbackData.feedback_month || getCurrentMonth(),
    };

    // Check if feedback already exists for this month
    const { data: existingFeedback, error: checkError } = await supabase
      .from('monthly_feedback')
      .select('id')
      .eq('facilitation_id', feedback.facilitation_id)
      .eq('submitter_id', user.id)
      .eq('feedback_month', feedback.feedback_month)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingFeedback) {
      throw new Error('You have already submitted feedback for this month. You can only submit one feedback entry per month.');
    }

    // Insert feedback
    const { data, error } = await supabase
      .from('monthly_feedback')
      .insert(feedback)
      .select()
      .single();

    if (error) throw error;

    // Create notification for recipient
    await supabase
      .from('notifications')
      .insert({
        user_id: feedbackData.recipient_id,
        type: 'rating_received',
        title: 'New Monthly Feedback Received',
        message: `You received a ${feedback.rating}-star rating for ${feedback.feedback_month}`,
        related_id: data.id,
      });

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting monthly feedback:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get feedback for a specific facilitation request
 * @param {string} facilitationId - Facilitation request ID
 * @param {string} month - Optional month filter (YYYY-MM)
 */
export const getFeedbackByFacilitation = async (facilitationId, month = null) => {
  try {
    let query = supabase
      .from('monthly_feedback')
      .select(`
        *,
        submitter:submitter_id(id, full_name, role),
        recipient:recipient_id(id, full_name, role)
      `)
      .eq('facilitation_id', facilitationId)
      .order('feedback_month', { ascending: false });

    if (month) {
      query = query.eq('feedback_month', month);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all feedback received by a user
 * @param {string} userId - User ID
 * @param {number} limit - Optional limit
 */
export const getFeedbackReceived = async (userId, limit = 50) => {
  try {
    console.log('[FeedbackService] Fetching received feedback for user:', userId);

    // First, verify user is authenticated
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log('[FeedbackService] Auth user ID:', authUser?.id);
    console.log('[FeedbackService] Requesting feedback for user ID:', userId);
    console.log('[FeedbackService] IDs match:', authUser?.id === userId);

    const { data, error } = await supabase
      .from('monthly_feedback')
      .select(`
        *,
        submitter:submitter_id(id, full_name, role),
        facilitation:facilitation_id(id, status)
      `)
      .eq('recipient_id', userId)
      .order('feedback_month', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[FeedbackService] Supabase error fetching received feedback:', error);
      console.error('[FeedbackService] Error code:', error.code);
      console.error('[FeedbackService] Error message:', error.message);
      console.error('[FeedbackService] Error details:', error.details);
      throw error;
    }

    console.log('[FeedbackService] Received feedback count:', data?.length || 0);
    console.log('[FeedbackService] Received feedback data:', data);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[FeedbackService] Error fetching received feedback:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all feedback submitted by a user
 * @param {string} userId - User ID
 * @param {number} limit - Optional limit
 */
export const getFeedbackSubmitted = async (userId, limit = 50) => {
  try {
    console.log('[FeedbackService] Fetching submitted feedback for user:', userId);

    // First, verify user is authenticated
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log('[FeedbackService] Auth user ID:', authUser?.id);
    console.log('[FeedbackService] Requesting feedback for user ID:', userId);
    console.log('[FeedbackService] IDs match:', authUser?.id === userId);

    const { data, error } = await supabase
      .from('monthly_feedback')
      .select(`
        *,
        recipient:recipient_id(id, full_name, role),
        facilitation:facilitation_id(id, status)
      `)
      .eq('submitter_id', userId)
      .order('feedback_month', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[FeedbackService] Supabase error fetching submitted feedback:', error);
      console.error('[FeedbackService] Error code:', error.code);
      console.error('[FeedbackService] Error message:', error.message);
      console.error('[FeedbackService] Error details:', error.details);
      throw error;
    }

    console.log('[FeedbackService] Submitted feedback count:', data?.length || 0);
    console.log('[FeedbackService] Submitted feedback data:', data);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[FeedbackService] Error fetching submitted feedback:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Check if user can submit feedback for a facilitation this month
 * @param {string} facilitationId - Facilitation request ID
 */
export const canSubmitFeedback = async (facilitationId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const currentMonth = getCurrentMonth();

    // Check if already submitted this month
    const { data, error } = await supabase
      .from('monthly_feedback')
      .select('id')
      .eq('facilitation_id', facilitationId)
      .eq('submitter_id', user.id)
      .eq('feedback_month', currentMonth)
      .maybeSingle();

    if (error) throw error;

    return { success: true, canSubmit: !data, month: currentMonth };
  } catch (error) {
    console.error('Error checking feedback eligibility:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check feedback eligibility for multiple facilitations
 * @param {Array<string>} facilitationIds - Array of facilitation request IDs
 * @returns {Promise<Object>} Map of facilitation ID to eligibility status
 */
export const checkMultipleFeedbackEligibility = async (facilitationIds) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const currentMonth = getCurrentMonth();

    // Get all feedback for these facilitations for current month
    const { data, error } = await supabase
      .from('monthly_feedback')
      .select('facilitation_id')
      .in('facilitation_id', facilitationIds)
      .eq('submitter_id', user.id)
      .eq('feedback_month', currentMonth);

    if (error) throw error;

    // Create a map of facilitation ID to submission status
    const submittedIds = new Set(data?.map(f => f.facilitation_id) || []);
    const eligibilityMap = {};

    facilitationIds.forEach(id => {
      eligibilityMap[id] = {
        canSubmit: !submittedIds.has(id),
        month: currentMonth,
      };
    });

    return { success: true, data: eligibilityMap };
  } catch (error) {
    console.error('Error checking multiple feedback eligibility:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get feedback statistics for a user
 * @param {string} userId - User ID
 */
export const getFeedbackStats = async (userId) => {
  try {
    // Get all feedback received
    const { data: receivedFeedback, error: receivedError } = await supabase
      .from('monthly_feedback')
      .select('rating, feedback_month')
      .eq('recipient_id', userId)
      .order('feedback_month', { ascending: false });

    if (receivedError) throw receivedError;

    // Calculate statistics
    const totalFeedback = receivedFeedback?.length || 0;
    const averageRating = totalFeedback > 0
      ? receivedFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;

    // Count by rating
    const ratingCounts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    receivedFeedback?.forEach(f => {
      ratingCounts[f.rating]++;
    });

    // Get recent months
    const recentMonths = receivedFeedback?.slice(0, 6).map(f => ({
      month: f.feedback_month,
      rating: f.rating,
    })) || [];

    return {
      success: true,
      data: {
        totalFeedback,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingCounts,
        recentMonths,
      },
    };
  } catch (error) {
    console.error('Error fetching feedback statistics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all feedback for admin review
 * @param {Object} filters - Optional filters
 * @param {number} filters.minRating - Minimum rating
 * @param {number} filters.maxRating - Maximum rating
 * @param {string} filters.role - Filter by submitter role
 * @param {string} filters.month - Filter by month
 */
export const getAllFeedbackForAdmin = async (filters = {}) => {
  try {
    let query = supabase
      .from('monthly_feedback')
      .select(`
        *,
        submitter:submitter_id(id, full_name, role, email),
        recipient:recipient_id(id, full_name, role, email),
        facilitation:facilitation_id(id, status)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }
    if (filters.maxRating) {
      query = query.lte('rating', filters.maxRating);
    }
    if (filters.role) {
      query = query.eq('submitter_role', filters.role);
    }
    if (filters.month) {
      query = query.eq('feedback_month', filters.month);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update monthly feedback (only within 24 hours)
 * @param {string} feedbackId - Feedback ID
 * @param {Object} updates - Fields to update
 */
export const updateMonthlyFeedback = async (feedbackId, updates) => {
  try {
    const { data, error } = await supabase
      .from('monthly_feedback')
      .update(updates)
      .eq('id', feedbackId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating feedback:', error);
    return { success: false, error: error.message };
  }
};

/**
 * DEBUG: Test feedback query and RLS
 * This function helps diagnose why feedback isn't showing up
 */
export const debugFeedbackAccess = async () => {
  try {
    console.log('=== FEEDBACK DEBUG START ===');

    // 1. Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('1. Auth Status:', {
      authenticated: !!user,
      userId: user?.id,
      error: authError
    });

    if (!user) {
      console.log('ERROR: User not authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    // 2. Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('2. User Profile:', {
      found: !!profile,
      role: profile?.role,
      fullName: profile?.full_name,
      error: profileError
    });

    // 3. Test basic query (no filters)
    const { data: allFeedback, error: allError, count: allCount } = await supabase
      .from('monthly_feedback')
      .select('*', { count: 'exact' });

    console.log('3. All Feedback Query (RLS applied):', {
      count: allCount,
      recordsReturned: allFeedback?.length || 0,
      error: allError
    });

    // 4. Test received feedback query
    const { data: receivedData, error: receivedError, count: receivedCount } = await supabase
      .from('monthly_feedback')
      .select('*', { count: 'exact' })
      .eq('recipient_id', user.id);

    console.log('4. Received Feedback Query:', {
      count: receivedCount,
      recordsReturned: receivedData?.length || 0,
      userId: user.id,
      error: receivedError,
      sample: receivedData?.[0]
    });

    // 5. Test submitted feedback query
    const { data: submittedData, error: submittedError, count: submittedCount } = await supabase
      .from('monthly_feedback')
      .select('*', { count: 'exact' })
      .eq('submitter_id', user.id);

    console.log('5. Submitted Feedback Query:', {
      count: submittedCount,
      recordsReturned: submittedData?.length || 0,
      userId: user.id,
      error: submittedError,
      sample: submittedData?.[0]
    });

    // 6. Check facilitation requests
    const { data: facilitations, error: facError } = await supabase
      .from('facilitation_requests')
      .select('id, status, requester_id, target_id')
      .or(`requester_id.eq.${user.id},target_id.eq.${user.id}`)
      .in('status', ['matched', 'completed']);

    console.log('6. User Facilitations:', {
      count: facilitations?.length || 0,
      facilitations: facilitations,
      error: facError
    });

    console.log('=== FEEDBACK DEBUG END ===');

    return {
      success: true,
      debug: {
        authenticated: !!user,
        userId: user.id,
        userRole: profile?.role,
        receivedCount,
        submittedCount,
        facilitationsCount: facilitations?.length || 0,
        allFeedbackCount: allCount,
      }
    };
  } catch (error) {
    console.error('Debug function error:', error);
    return { success: false, error: error.message };
  }
};
