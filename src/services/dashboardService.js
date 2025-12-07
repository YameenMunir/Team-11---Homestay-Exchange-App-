import supabase from '../utils/supabase';

/**
 * Dashboard service for fetching user-specific dashboard data
 */
export const dashboardService = {
  /**
   * Get host dashboard data
   * @param {string} userId - The host's user ID
   * @returns {Promise<Object>} Host dashboard data
   */
  async getHostDashboardData(userId) {
    try {
      // Fetch current student arrangement (active facilitation)
      const { data: currentArrangement, error: arrangementError } = await supabase
        .from('facilitation_requests')
        .select(`
          *,
          requester:user_profiles!requester_id (
            id,
            full_name,
            email,
            guest_profile:guest_profiles (
              university,
              course,
              profile_picture_url
            )
          )
        `)
        .eq('target_id', userId)
        .eq('status', 'matched')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch pending facilitation requests
      const { data: pendingRequests, error: pendingError } = await supabase
        .from('facilitation_requests')
        .select(`
          *,
          requester:user_profiles!requester_id (
            id,
            full_name,
            email,
            guest_profile:guest_profiles (
              university,
              course
            )
          )
        `)
        .eq('target_id', userId)
        .in('status', ['pending', 'in_review'])
        .order('created_at', { ascending: false });

      // Fetch host's ratings from monthly_feedback
      const { data: ratings, error: ratingsError } = await supabase
        .from('monthly_feedback')
        .select('rating, feedback_month, created_at')
        .eq('recipient_id', userId)
        .eq('recipient_role', 'host')
        .order('created_at', { ascending: false });

      // Calculate review count
      const reviewCount = ratings?.length || 0;

      // Get current student details if arrangement exists
      let currentStudent = null;
      if (currentArrangement && currentArrangement.requester) {
        const requesterProfile = currentArrangement.requester;
        const guestProfile = requesterProfile.guest_profile;

        // Fetch hours logged this month for current student from monthly_feedback
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        let hoursThisMonth = 0;
        try {
          const { data: monthlyFeedback, error: feedbackError } = await supabase
            .from('monthly_feedback')
            .select('hours_contributed')
            .eq('facilitation_id', currentArrangement.id)
            .gte('created_at', startOfMonth.toISOString());

          if (!feedbackError && monthlyFeedback) {
            hoursThisMonth = monthlyFeedback.reduce(
              (total, feedback) => total + (feedback.hours_contributed || 0),
              0
            );
          }
        } catch (error) {
          console.warn('Could not fetch hours for current month:', error);
          hoursThisMonth = 0;
        }

        currentStudent = {
          name: requesterProfile.full_name || 'Student',
          university: guestProfile?.university || '',
          startDate: new Date(currentArrangement.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          servicesProvided: currentArrangement.services_offered || [],
          hoursThisMonth,
          rating: 0, // Note: We'll need to calculate this from ratings table
          imageUrl: guestProfile?.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(requesterProfile.full_name || 'Student')}`,
        };
      }

      // Format pending requests
      const formattedPendingRequests = pendingRequests?.map((request) => ({
        id: request.id,
        studentName: request.requester?.full_name || 'Student',
        university: request.requester?.guest_profile?.university || '',
        course: request.requester?.guest_profile?.course || '',
        status: request.status,
        createdAt: request.created_at,
      })) || [];

      return {
        currentStudent,
        pendingRequests: formattedPendingRequests,
        pendingRequestsCount: formattedPendingRequests.length,
        reviewCount,
        ratings: ratings || [],
      };
    } catch (error) {
      console.error('Error fetching host dashboard data:', error);
      throw error;
    }
  },

  /**
   * Get student dashboard data
   * @param {string} userId - The student's user ID
   * @returns {Promise<Object>} Student dashboard data
   */
  async getStudentDashboardData(userId) {
    try {
      // Fetch current host arrangement (active facilitation)
      const { data: currentArrangement, error: arrangementError } = await supabase
        .from('facilitation_requests')
        .select(`
          *,
          target:user_profiles!target_id (
            id,
            full_name,
            email,
            host_profile:host_profiles (
              address,
              city,
              postcode,
              profile_picture_url
            )
          )
        `)
        .eq('requester_id', userId)
        .eq('status', 'matched')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch all facilitation requests
      const { data: allRequests, error: requestsError } = await supabase
        .from('facilitation_requests')
        .select('*')
        .eq('requester_id', userId)
        .order('created_at', { ascending: false });

      // Fetch monthly feedback count for review count
      const { data: monthlyFeedback, error: feedbackError } = await supabase
        .from('monthly_feedback')
        .select('rating')
        .eq('recipient_id', userId)
        .eq('recipient_role', 'guest');

      const reviewCount = monthlyFeedback?.length || 0;

      // Fetch total hours from all monthly feedback
      let totalHours = 0;
      try {
        const { data: allFeedback, error: feedbackError } = await supabase
          .from('monthly_feedback')
          .select('hours_contributed')
          .eq('submitter_id', userId)
          .eq('submitter_role', 'guest');

        if (!feedbackError && allFeedback) {
          totalHours = allFeedback.reduce(
            (total, feedback) => total + (feedback.hours_contributed || 0),
            0
          );
        }
      } catch (error) {
        console.warn('Could not fetch total hours:', error);
        totalHours = 0;
      }

      // Get current host details if arrangement exists
      let currentHost = null;
      if (currentArrangement && currentArrangement.target) {
        const targetProfile = currentArrangement.target;
        const hostProfile = targetProfile.host_profile;

        // Fetch hours logged this month from monthly_feedback
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        let hoursThisMonth = 0;
        try {
          const { data: monthlyFeedback, error: feedbackError } = await supabase
            .from('monthly_feedback')
            .select('hours_contributed')
            .eq('facilitation_id', currentArrangement.id)
            .gte('created_at', startOfMonth.toISOString());

          if (!feedbackError && monthlyFeedback) {
            hoursThisMonth = monthlyFeedback.reduce(
              (total, feedback) => total + (feedback.hours_contributed || 0),
              0
            );
          }
        } catch (error) {
          console.warn('Could not fetch hours for current month:', error);
          hoursThisMonth = 0;
        }

        const location = [hostProfile?.city, hostProfile?.postcode]
          .filter(Boolean)
          .join(', ') || 'Location not specified';

        currentHost = {
          name: targetProfile.full_name || 'Host',
          location,
          since: new Date(currentArrangement.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          servicesProvided: currentArrangement.services_offered || [],
          hoursThisMonth,
          imageUrl: hostProfile?.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetProfile.full_name || 'Host')}`,
        };
      }

      // Count requests by status
      const connectionRequests = {
        pending: allRequests?.filter((r) => r.status === 'pending').length || 0,
        approved: allRequests?.filter((r) => r.status === 'matched').length || 0,
        total: allRequests?.length || 0,
      };

      // Fetch saved hosts (assuming there's a saved_hosts table)
      const { data: savedHosts } = await supabase
        .from('saved_hosts')
        .select('*')
        .eq('guest_id', userId);

      return {
        currentHost,
        reviewCount,
        totalHours,
        savedHosts: savedHosts?.length || 0,
        connectionRequests,
      };
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      throw error;
    }
  },

  /**
   * Get notifications for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<Array>} User notifications
   */
  async getNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - The notification ID
   */
  async markNotificationAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - The user's ID
   */
  async markAllNotificationsAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   * @param {string} notificationId - The notification ID
   */
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
};

