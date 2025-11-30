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
          guest:guest_id (
            id,
            user_id,
            university,
            course,
            profile_picture_url,
            average_rating,
            user_profiles!inner (
              full_name,
              email
            )
          )
        `)
        .eq('host_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch pending facilitation requests
      const { data: pendingRequests, error: pendingError } = await supabase
        .from('facilitation_requests')
        .select(`
          *,
          guest:guest_id (
            id,
            user_id,
            university,
            course,
            user_profiles!inner (
              full_name
            )
          )
        `)
        .eq('host_id', userId)
        .in('status', ['pending', 'under_review'])
        .order('created_at', { ascending: false });

      // Fetch host's ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('ratee_id', userId)
        .order('created_at', { ascending: false });

      // Calculate review count
      const reviewCount = ratings?.length || 0;

      // Get current student details if arrangement exists
      let currentStudent = null;
      if (currentArrangement && currentArrangement.guest) {
        const guestProfile = currentArrangement.guest;

        // Fetch hours logged this month for current student
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: monthlyReports } = await supabase
          .from('monthly_reports')
          .select('hours_completed')
          .eq('facilitation_id', currentArrangement.id)
          .gte('created_at', startOfMonth.toISOString());

        const hoursThisMonth = monthlyReports?.reduce(
          (total, report) => total + (report.hours_completed || 0),
          0
        ) || 0;

        currentStudent = {
          name: guestProfile.user_profiles?.full_name || 'Student',
          university: guestProfile.university || '',
          startDate: new Date(currentArrangement.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          servicesProvided: currentArrangement.services_offered || [],
          hoursThisMonth,
          rating: guestProfile.average_rating || 0,
          imageUrl: guestProfile.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(guestProfile.user_profiles?.full_name || 'Student')}`,
        };
      }

      // Format pending requests
      const formattedPendingRequests = pendingRequests?.map((request) => ({
        id: request.id,
        studentName: request.guest?.user_profiles?.full_name || 'Student',
        university: request.guest?.university || '',
        course: request.guest?.course || '',
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
          host:host_id (
            id,
            user_id,
            address,
            city,
            postcode,
            profile_picture_url,
            average_rating,
            user_profiles!inner (
              full_name
            )
          )
        `)
        .eq('guest_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch all facilitation requests
      const { data: allRequests, error: requestsError } = await supabase
        .from('facilitation_requests')
        .select('*')
        .eq('guest_id', userId)
        .order('created_at', { ascending: false });

      // Fetch student's ratings to calculate recognition level
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('ratee_id', userId)
        .order('created_at', { ascending: false });

      // Calculate consecutive high ratings (4-5 stars)
      let consecutiveHighRatings = 0;
      for (const rating of ratings || []) {
        if (rating.rating >= 4) {
          consecutiveHighRatings++;
        } else {
          break;
        }
      }

      // Determine recognition level
      let recognitionLevel = 'bronze';
      if (consecutiveHighRatings >= 6) {
        recognitionLevel = 'gold';
      } else if (consecutiveHighRatings >= 4) {
        recognitionLevel = 'silver';
      }

      // Fetch total hours from all completed monthly reports
      const { data: allReports } = await supabase
        .from('monthly_reports')
        .select('hours_completed')
        .eq('guest_id', userId);

      const totalHours = allReports?.reduce(
        (total, report) => total + (report.hours_completed || 0),
        0
      ) || 0;

      // Get current host details if arrangement exists
      let currentHost = null;
      if (currentArrangement && currentArrangement.host) {
        const hostProfile = currentArrangement.host;

        // Fetch hours logged this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: monthlyReports } = await supabase
          .from('monthly_reports')
          .select('hours_completed')
          .eq('facilitation_id', currentArrangement.id)
          .gte('created_at', startOfMonth.toISOString());

        const hoursThisMonth = monthlyReports?.reduce(
          (total, report) => total + (report.hours_completed || 0),
          0
        ) || 0;

        const location = [hostProfile.city, hostProfile.postcode]
          .filter(Boolean)
          .join(', ') || 'Location not specified';

        currentHost = {
          name: hostProfile.user_profiles?.full_name || 'Host',
          location,
          since: new Date(currentArrangement.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          servicesProvided: currentArrangement.services_offered || [],
          hoursThisMonth,
          imageUrl: hostProfile.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(hostProfile.user_profiles?.full_name || 'Host')}`,
        };
      }

      // Count requests by status
      const connectionRequests = {
        pending: allRequests?.filter((r) => r.status === 'pending').length || 0,
        approved: allRequests?.filter((r) => r.status === 'approved').length || 0,
        total: allRequests?.length || 0,
      };

      // Fetch saved hosts (assuming there's a saved_hosts table)
      const { data: savedHosts } = await supabase
        .from('saved_hosts')
        .select('*')
        .eq('guest_id', userId);

      return {
        currentHost,
        recognitionLevel,
        consecutiveRatings: consecutiveHighRatings,
        reviewCount: ratings?.length || 0,
        totalHours,
        savedHosts: savedHosts?.length || 0,
        connectionRequests,
        ratings: ratings || [],
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
