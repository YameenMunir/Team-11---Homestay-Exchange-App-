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
        approved: data.filter(r => r.status === 'approved').length,
        reviewing: data.filter(r => r.status === 'reviewing').length,
        rejected: data.filter(r => r.status === 'rejected').length,
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
};

export default facilitationService;
