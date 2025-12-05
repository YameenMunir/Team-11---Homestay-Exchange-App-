import supabase from '../utils/supabase';

/**
 * Service for managing facilitation requests
 */
export const facilitationService = {
  /**
   * Create a new facilitation request
   * @param {string} targetId - Host user ID
   * @param {string} message - Student's introduction message
   * @returns {Promise} Created request data
   */
  async createRequest(targetId, message) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('facilitation_requests')
      .insert({
        requester_id: user.id,
        target_id: targetId,
        requester_role: 'guest',
        message: message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[FacilitationService] Error creating request:', error);
      throw error;
    }

    console.log('[FacilitationService] Request created successfully:', data);
    return data;
  },

  /**
   * Get all facilitation requests for the current user
   * @returns {Promise<Array>} Array of requests with host details
   */
  async getUserRequests() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('facilitation_requests')
        .select(`
          id,
          requester_id,
          target_id,
          requester_role,
          status,
          message,
          admin_notes,
          created_at,
          reviewed_at,
          reviewed_by,
          matched_at,
          completed_at,
          target:user_profiles!target_id (
            id,
            full_name,
            email,
            host_profile:host_profiles!user_id (
              city,
              postcode,
              address
            )
          ),
          reviewer:user_profiles!reviewed_by (
            id,
            full_name,
            email,
            phone_number
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data into a more usable format
      const requests = data.map(req => ({
        id: req.id,
        hostId: req.target_id,
        hostName: req.target?.full_name || 'Unknown Host',
        hostLocation: req.target?.host_profile
          ? `${req.target.host_profile.city}${req.target.host_profile.postcode ? ', ' + req.target.host_profile.postcode : ''}`
          : 'Location not specified',
        requestDate: req.created_at,
        status: req.status,
        message: req.message,
        adminNotes: req.admin_notes,
        reviewedAt: req.reviewed_at,
        matchedAt: req.matched_at,
        completedAt: req.completed_at,
        adminContact: req.reviewer ? {
          name: req.reviewer.full_name,
          email: req.reviewer.email,
          phone: req.reviewer.phone_number,
        } : null,
      }));

      console.log('[FacilitationService] Retrieved requests:', requests.length);
      return requests;
    } catch (err) {
      console.error('[FacilitationService] Error getting requests:', err);
      return [];
    }
  },

  /**
   * Get a single facilitation request by ID
   * @param {string} requestId - Request ID
   * @returns {Promise} Request data
   */
  async getRequestById(requestId) {
    const { data, error } = await supabase
      .from('facilitation_requests')
      .select(`
        *,
        target:user_profiles!target_id (
          id,
          full_name,
          email,
          host_profile:host_profiles!user_id (
            city,
            postcode,
            address
          )
        ),
        reviewer:user_profiles!reviewed_by (
          id,
          full_name,
          email,
          phone_number
        )
      `)
      .eq('id', requestId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Get count of user's facilitation requests by status
   * @returns {Promise<Object>} Counts by status
   */
  async getRequestCounts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { pending: 0, approved: 0, total: 0 };
      }

      const { data, error } = await supabase
        .from('facilitation_requests')
        .select('status')
        .eq('requester_id', user.id);

      if (error) {
        throw error;
      }

      const counts = {
        pending: data.filter(r => r.status === 'pending').length,
        matched: data.filter(r => r.status === 'matched').length,
        in_review: data.filter(r => r.status === 'in_review').length,
        cancelled: data.filter(r => r.status === 'cancelled').length,
        total: data.length,
      };

      return counts;
    } catch (err) {
      console.error('[FacilitationService] Error getting request counts:', err);
      return { pending: 0, approved: 0, total: 0 };
    }
  },

  /**
   * Check if user has already sent a facilitation request to a specific host
   * @param {string} targetId - Host user ID
   * @returns {Promise<Object|null>} Existing request or null
   */
  async checkExistingRequest(targetId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('facilitation_requests')
        .select('id, status, created_at')
        .eq('requester_id', user.id)
        .eq('target_id', targetId)
        .single();

      if (error) {
        // If no rows found, error.code will be 'PGRST116'
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (err) {
      console.error('[FacilitationService] Error checking existing request:', err);
      return null;
    }
  },

  /**
   * Get all facilitation requests for a host (where user is the target)
   * @returns {Promise<Array>} Array of requests with student details
   */
  async getHostRequests() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      console.log('[FacilitationService] Getting host requests for user:', user?.id);

      if (!user) {
        console.warn('[FacilitationService] No authenticated user found');
        return [];
      }

      const { data, error } = await supabase
        .from('facilitation_requests')
        .select(`
          id,
          requester_id,
          target_id,
          requester_role,
          status,
          message,
          admin_notes,
          created_at,
          reviewed_at,
          reviewed_by,
          matched_at,
          completed_at,
          requester:user_profiles!requester_id (
            id,
            full_name,
            email,
            phone_number,
            guest_profile:guest_profiles!user_id (
              university,
              course,
              bio
            )
          ),
          reviewer:user_profiles!reviewed_by (
            id,
            full_name,
            email,
            phone_number
          )
        `)
        .eq('target_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[FacilitationService] Database error:', error);
        console.error('[FacilitationService] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('[FacilitationService] Raw data from database:', data);
      console.log('[FacilitationService] Number of records retrieved:', data?.length || 0);

      // Transform the data
      const requests = data.map(req => ({
        id: req.id,
        studentId: req.requester_id,
        studentName: req.requester?.full_name || 'Unknown Student',
        studentEmail: req.requester?.email,
        studentPhone: req.requester?.phone_number,
        university: req.requester?.guest_profile?.university,
        fieldOfStudy: req.requester?.guest_profile?.course,
        bio: req.requester?.guest_profile?.bio,
        requestDate: req.created_at,
        status: req.status,
        message: req.message,
        adminNotes: req.admin_notes,
        reviewedAt: req.reviewed_at,
        matchedAt: req.matched_at,
        completedAt: req.completed_at,
        adminContact: req.reviewer ? {
          name: req.reviewer.full_name,
          email: req.reviewer.email,
          phone: req.reviewer.phone_number,
        } : null,
      }));

      console.log('[FacilitationService] Transformed requests:', requests);
      console.log('[FacilitationService] Retrieved host requests:', requests.length);
      return requests;
    } catch (err) {
      console.error('[FacilitationService] Error getting host requests:', err);
      return [];
    }
  },

  /**
   * Host accepts a facilitation request
   * @param {string} requestId - Request ID
   * @returns {Promise} Updated request data
   */
  async acceptRequest(requestId) {
    const { data, error } = await supabase
      .from('facilitation_requests')
      .update({
        status: 'in_review',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('[FacilitationService] Error accepting request:', error);
      throw error;
    }

    console.log('[FacilitationService] Request accepted:', data);
    return data;
  },

  /**
   * Host declines a facilitation request
   * @param {string} requestId - Request ID
   * @returns {Promise} Updated request data
   */
  async declineRequest(requestId) {
    const { data, error } = await supabase
      .from('facilitation_requests')
      .update({
        status: 'cancelled',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('[FacilitationService] Error declining request:', error);
      throw error;
    }

    console.log('[FacilitationService] Request declined:', data);
    return data;
  },

  /**
   * Get all facilitation requests for admin review
   * @returns {Promise<Array>} Array of requests needing admin review
   */
  async getAdminRequests() {
    try {
      const { data, error } = await supabase
        .from('facilitation_requests')
        .select(`
          id,
          requester_id,
          target_id,
          requester_role,
          status,
          message,
          admin_notes,
          created_at,
          reviewed_at,
          reviewed_by,
          matched_at,
          completed_at,
          requester:user_profiles!requester_id (
            id,
            full_name,
            email,
            phone_number,
            guest_profile:guest_profiles!user_id (
              university,
              course
            )
          ),
          target:user_profiles!target_id (
            id,
            full_name,
            email,
            phone_number,
            host_profile:host_profiles!user_id (
              city,
              postcode,
              address
            )
          ),
          reviewer:user_profiles!reviewed_by (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data
      const requests = data.map(req => ({
        id: req.id,
        studentId: req.requester_id,
        studentName: req.requester?.full_name || 'Unknown Student',
        studentEmail: req.requester?.email,
        studentPhone: req.requester?.phone_number,
        studentUniversity: req.requester?.guest_profile?.university,
        studentFieldOfStudy: req.requester?.guest_profile?.course,
        hostId: req.target_id,
        hostName: req.target?.full_name || 'Unknown Host',
        hostEmail: req.target?.email,
        hostPhone: req.target?.phone_number,
        hostLocation: req.target?.host_profile
          ? `${req.target.host_profile.city}${req.target.host_profile.postcode ? ', ' + req.target.host_profile.postcode : ''}`
          : 'Location not specified',
        requestDate: req.created_at,
        status: req.status,
        message: req.message,
        adminNotes: req.admin_notes,
        reviewedAt: req.reviewed_at,
        matchedAt: req.matched_at,
        completedAt: req.completed_at,
        reviewedBy: req.reviewer?.full_name,
      }));

      console.log('[FacilitationService] Retrieved admin requests:', requests.length);
      return requests;
    } catch (err) {
      console.error('[FacilitationService] Error getting admin requests:', err);
      return [];
    }
  },

  /**
   * Admin approves a facilitation request
   * @param {string} requestId - Request ID
   * @param {string} adminNotes - Optional admin notes
   * @returns {Promise} Updated request data
   */
  async approveRequest(requestId, adminNotes = '') {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('facilitation_requests')
      .update({
        status: 'matched',
        admin_notes: adminNotes,
        reviewed_by: user?.id,
        matched_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('[FacilitationService] Error approving request:', error);
      throw error;
    }

    console.log('[FacilitationService] Request approved:', data);
    return data;
  },

  /**
   * Admin rejects a facilitation request
   * @param {string} requestId - Request ID
   * @param {string} adminNotes - Required rejection reason
   * @returns {Promise} Updated request data
   */
  async rejectRequest(requestId, adminNotes) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('facilitation_requests')
      .update({
        status: 'cancelled',
        admin_notes: adminNotes,
        reviewed_by: user?.id,
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('[FacilitationService] Error rejecting request:', error);
      throw error;
    }

    console.log('[FacilitationService] Request rejected:', data);
    return data;
  },
};

export default facilitationService;
