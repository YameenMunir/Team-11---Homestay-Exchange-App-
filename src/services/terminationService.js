import supabase from '../utils/supabase';

/**
 * Service for managing facilitation termination requests
 * Allows hosts or guests to request ending a facilitation
 * Requires admin approval to actually terminate
 */
export const terminationService = {
  /**
   * Create a new termination request
   * @param {string} facilitationId - Facilitation ID to terminate
   * @param {string} requesterRole - 'host' or 'guest'
   * @param {string} reason - Reason for termination
   * @returns {Promise} Created termination request
   */
  async createTerminationRequest(facilitationId, requesterRole, reason) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!reason || reason.trim() === '') {
        throw new Error('Reason for termination is required');
      }

      // Check if there's already a pending termination request for this facilitation
      const { data: existingRequest } = await supabase
        .from('termination_requests')
        .select('id, status')
        .eq('facilitation_id', facilitationId)
        .eq('status', 'pending')
        .single();

      if (existingRequest) {
        throw new Error('A termination request for this facilitation is already pending');
      }

      const { data, error } = await supabase
        .from('termination_requests')
        .insert({
          facilitation_id: facilitationId,
          requester_id: user.id,
          requester_role: requesterRole,
          reason: reason.trim(),
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('[TerminationService] Error creating termination request:', error);
        throw error;
      }

      console.log('[TerminationService] Termination request created successfully:', data);
      return data;
    } catch (err) {
      console.error('[TerminationService] Error in createTerminationRequest:', err);
      throw err;
    }
  },

  /**
   * Get termination requests for current user
   * @returns {Promise<Array>} Array of user's termination requests with details
   */
  async getUserTerminationRequests() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('termination_requests')
        .select(`
          id,
          facilitation_id,
          requester_id,
          requester_role,
          reason,
          status,
          created_at,
          reviewed_at,
          admin_notes,
          facilitation:facilitation_requests!facilitation_id (
            id,
            status,
            matched_at,
            requester:user_profiles!requester_id (
              id,
              full_name
            ),
            target:user_profiles!target_id (
              id,
              full_name
            )
          ),
          reviewer:user_profiles!reviewed_by (
            id,
            full_name
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data
      const requests = data.map(req => ({
        id: req.id,
        facilitationId: req.facilitation_id,
        requesterRole: req.requester_role,
        reason: req.reason,
        status: req.status,
        createdAt: req.created_at,
        reviewedAt: req.reviewed_at,
        adminNotes: req.admin_notes,
        partnerName: req.requester_role === 'guest'
          ? req.facilitation?.target?.full_name
          : req.facilitation?.requester?.full_name,
        reviewerName: req.reviewer?.full_name,
      }));

      console.log('[TerminationService] Retrieved user termination requests:', requests.length);
      return requests;
    } catch (err) {
      console.error('[TerminationService] Error getting user termination requests:', err);
      return [];
    }
  },

  /**
   * Get all termination requests for admin review
   * @returns {Promise<Array>} Array of all termination requests
   */
  async getAdminTerminationRequests() {
    try {
      const { data, error } = await supabase
        .from('termination_requests')
        .select(`
          id,
          facilitation_id,
          requester_id,
          requester_role,
          reason,
          status,
          created_at,
          reviewed_at,
          reviewed_by,
          admin_notes,
          requester:user_profiles!requester_id (
            id,
            full_name,
            email,
            phone_number
          ),
          facilitation:facilitation_requests!facilitation_id (
            id,
            status,
            matched_at,
            requester:user_profiles!requester_id (
              id,
              full_name,
              email,
              guest_profile:guest_profiles (
                university,
                course
              )
            ),
            target:user_profiles!target_id (
              id,
              full_name,
              email,
              host_profile:host_profiles!user_id (
                city,
                postcode
              )
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
        facilitationId: req.facilitation_id,
        requesterId: req.requester_id,
        requesterName: req.requester?.full_name || 'Unknown User',
        requesterEmail: req.requester?.email,
        requesterPhone: req.requester?.phone_number,
        requesterRole: req.requester_role,
        reason: req.reason,
        status: req.status,
        createdAt: req.created_at,
        reviewedAt: req.reviewed_at,
        adminNotes: req.admin_notes,
        reviewedBy: req.reviewer?.full_name,
        // Student info
        studentId: req.facilitation?.requester?.id,
        studentName: req.facilitation?.requester?.full_name || 'Unknown Student',
        studentEmail: req.facilitation?.requester?.email,
        studentUniversity: req.facilitation?.requester?.guest_profile?.university,
        studentCourse: req.facilitation?.requester?.guest_profile?.course,
        // Host info
        hostId: req.facilitation?.target?.id,
        hostName: req.facilitation?.target?.full_name || 'Unknown Host',
        hostEmail: req.facilitation?.target?.email,
        hostLocation: req.facilitation?.target?.host_profile
          ? `${req.facilitation.target.host_profile.city}${req.facilitation.target.host_profile.postcode ? ', ' + req.facilitation.target.host_profile.postcode : ''}`
          : 'Location not specified',
        // Facilitation info
        facilitationStatus: req.facilitation?.status,
        matchedAt: req.facilitation?.matched_at,
      }));

      console.log('[TerminationService] Retrieved admin termination requests:', requests.length);
      return requests;
    } catch (err) {
      console.error('[TerminationService] Error getting admin termination requests:', err);
      return [];
    }
  },

  /**
   * Check if facilitation has pending termination request
   * @param {string} facilitationId - Facilitation ID
   * @returns {Promise<Object|null>} Pending termination request or null
   */
  async checkPendingTermination(facilitationId) {
    try {
      const { data, error } = await supabase
        .from('termination_requests')
        .select('id, status, reason, created_at, requester_role')
        .eq('facilitation_id', facilitationId)
        .eq('status', 'pending')
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (err) {
      console.error('[TerminationService] Error checking pending termination:', err);
      return null;
    }
  },

  /**
   * Admin approves a termination request
   * @param {string} requestId - Termination request ID
   * @param {string} adminNotes - Optional admin notes
   * @returns {Promise} Updated request data
   */
  async approveTermination(requestId, adminNotes = '') {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the termination request to find the facilitation ID
      const { data: terminationRequest } = await supabase
        .from('termination_requests')
        .select('facilitation_id')
        .eq('id', requestId)
        .single();

      if (!terminationRequest) {
        throw new Error('Termination request not found');
      }

      // Update termination request status
      const { data: updatedRequest, error: requestError } = await supabase
        .from('termination_requests')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes,
        })
        .eq('id', requestId)
        .select()
        .single();

      if (requestError) {
        throw requestError;
      }

      // Update facilitation status to 'completed' (terminated)
      const { error: facilitationError } = await supabase
        .from('facilitation_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', terminationRequest.facilitation_id);

      if (facilitationError) {
        console.error('[TerminationService] Error updating facilitation status:', facilitationError);
        throw facilitationError;
      }

      console.log('[TerminationService] Termination request approved:', updatedRequest);
      return updatedRequest;
    } catch (err) {
      console.error('[TerminationService] Error approving termination:', err);
      throw err;
    }
  },

  /**
   * Admin rejects a termination request
   * @param {string} requestId - Termination request ID
   * @param {string} adminNotes - Required reason for rejection
   * @returns {Promise} Updated request data
   */
  async rejectTermination(requestId, adminNotes) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!adminNotes || adminNotes.trim() === '') {
        throw new Error('Reason for rejection is required');
      }

      const { data, error } = await supabase
        .from('termination_requests')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes.trim(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('[TerminationService] Termination request rejected:', data);
      return data;
    } catch (err) {
      console.error('[TerminationService] Error rejecting termination:', err);
      throw err;
    }
  },
};

export default terminationService;
