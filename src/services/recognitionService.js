import { supabase } from '../lib/supabaseClient';

/**
 * Student Recognition Service
 * Handles student recognition tier tracking (Bronze, Silver, Gold)
 */

/**
 * Get student's current recognition status
 * @param {string} studentId - Student user ID
 */
export const getRecognitionStatus = async (studentId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_student_recognition_status', { p_student_id: studentId });

    if (error) throw error;

    // The RPC returns a single row
    const status = data && data.length > 0 ? data[0] : null;

    return {
      success: true,
      data: status || {
        tier: 'none',
        consecutive_months: 0,
        months_to_next_tier: 2,
        next_tier: 'bronze',
      },
    };
  } catch (error) {
    console.error('Error fetching recognition status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get detailed recognition tier information for a student
 * @param {string} studentId - Student user ID
 */
export const getRecognitionDetails = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('student_recognition_tiers')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) throw error;

    // If no record exists, return default values
    if (!data) {
      return {
        success: true,
        data: {
          student_id: studentId,
          current_tier: 'none',
          consecutive_high_ratings: 0,
          last_high_rating_month: null,
          bronze_achieved_at: null,
          silver_achieved_at: null,
          gold_achieved_at: null,
        },
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching recognition details:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all students with a specific recognition tier
 * @param {string} tier - Recognition tier ('bronze', 'silver', 'gold')
 */
export const getStudentsByTier = async (tier) => {
  try {
    const { data, error } = await supabase
      .from('student_recognition_tiers')
      .select(`
        *,
        student:student_id(
          id,
          full_name,
          email,
          profile:guest_profiles(
            university,
            course,
            profile_picture_url,
            average_rating
          )
        )
      `)
      .eq('current_tier', tier)
      .order('consecutive_high_ratings', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching students by tier:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get leaderboard of top-performing students
 * @param {number} limit - Number of students to return
 */
export const getRecognitionLeaderboard = async (limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('student_recognition_tiers')
      .select(`
        *,
        student:student_id(
          id,
          full_name,
          email,
          profile:guest_profiles(
            university,
            course,
            profile_picture_url,
            average_rating
          )
        )
      `)
      .order('consecutive_high_ratings', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching recognition leaderboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get recognition tier statistics
 */
export const getRecognitionStats = async () => {
  try {
    const { data, error } = await supabase
      .from('student_recognition_tiers')
      .select('current_tier');

    if (error) throw error;

    // Count students by tier
    const stats = {
      total: data?.length || 0,
      bronze: 0,
      silver: 0,
      gold: 0,
      none: 0,
    };

    data?.forEach(record => {
      stats[record.current_tier]++;
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching recognition statistics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get tier badge information
 * @param {string} tier - Recognition tier
 */
export const getTierBadgeInfo = (tier) => {
  const badges = {
    none: {
      name: 'No Badge',
      color: 'gray',
      icon: '⭐',
      description: 'Keep providing excellent service to earn your first badge!',
      requirement: 'Achieve 2 consecutive months of 4-5 star ratings',
    },
    bronze: {
      name: 'Bronze',
      color: '#CD7F32',
      icon: '🥉',
      description: 'Consistent good performance',
      requirement: '2 consecutive months of 4-5 star ratings',
    },
    silver: {
      name: 'Silver',
      color: '#C0C0C0',
      icon: '🥈',
      description: 'Outstanding sustained performance',
      requirement: '4 consecutive months of 4-5 star ratings',
    },
    gold: {
      name: 'Gold',
      color: '#FFD700',
      icon: '🥇',
      description: 'Exceptional long-term excellence',
      requirement: '6 consecutive months of 4-5 star ratings',
    },
  };

  return badges[tier] || badges.none;
};

/**
 * Calculate progress to next tier
 * @param {number} consecutiveMonths - Current consecutive high rating months
 * @param {string} currentTier - Current tier
 */
export const calculateTierProgress = (consecutiveMonths, currentTier) => {
  const tierRequirements = {
    none: { next: 'bronze', required: 2 },
    bronze: { next: 'silver', required: 4 },
    silver: { next: 'gold', required: 6 },
    gold: { next: null, required: 6 },
  };

  const requirement = tierRequirements[currentTier];

  if (!requirement.next) {
    return {
      progress: 100,
      remaining: 0,
      nextTier: null,
      message: 'You have achieved the highest tier!',
    };
  }

  const progress = Math.min(100, (consecutiveMonths / requirement.required) * 100);
  const remaining = Math.max(0, requirement.required - consecutiveMonths);

  return {
    progress: Math.round(progress),
    remaining,
    nextTier: requirement.next,
    message: `${remaining} more month${remaining !== 1 ? 's' : ''} to ${requirement.next}`,
  };
};

/**
 * Get student's rating history with tier milestones
 * @param {string} studentId - Student user ID
 */
export const getRatingHistory = async (studentId) => {
  try {
    // Get monthly feedback ratings
    const { data: feedback, error: feedbackError } = await supabase
      .from('monthly_feedback')
      .select('rating, feedback_month, created_at')
      .eq('recipient_id', studentId)
      .eq('submitter_role', 'host')
      .order('feedback_month', { ascending: true });

    if (feedbackError) throw feedbackError;

    // Get recognition details for milestones
    const { data: recognition, error: recognitionError } = await supabase
      .from('student_recognition_tiers')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (recognitionError) throw recognitionError;

    // Calculate average rating per month
    const monthlyAverages = {};
    feedback?.forEach(f => {
      if (!monthlyAverages[f.feedback_month]) {
        monthlyAverages[f.feedback_month] = { total: 0, count: 0 };
      }
      monthlyAverages[f.feedback_month].total += f.rating;
      monthlyAverages[f.feedback_month].count += 1;
    });

    const history = Object.entries(monthlyAverages).map(([month, data]) => ({
      month,
      averageRating: Math.round((data.total / data.count) * 10) / 10,
      isHighRating: (data.total / data.count) >= 4.0,
    }));

    return {
      success: true,
      data: {
        history,
        milestones: {
          bronze_achieved_at: recognition?.bronze_achieved_at,
          silver_achieved_at: recognition?.silver_achieved_at,
          gold_achieved_at: recognition?.gold_achieved_at,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching rating history:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if a month qualifies as high rating (4-5 stars average)
 * @param {string} studentId - Student user ID
 * @param {string} month - Month in YYYY-MM format
 */
export const checkMonthQualification = async (studentId, month) => {
  try {
    const { data, error } = await supabase
      .from('monthly_feedback')
      .select('rating')
      .eq('recipient_id', studentId)
      .eq('feedback_month', month)
      .eq('submitter_role', 'host');

    if (error) throw error;

    if (!data || data.length === 0) {
      return { success: true, qualifies: false, averageRating: 0 };
    }

    const averageRating = data.reduce((sum, f) => sum + f.rating, 0) / data.length;
    const qualifies = averageRating >= 4.0;

    return {
      success: true,
      qualifies,
      averageRating: Math.round(averageRating * 10) / 10,
      feedbackCount: data.length,
    };
  } catch (error) {
    console.error('Error checking month qualification:', error);
    return { success: false, error: error.message };
  }
};
