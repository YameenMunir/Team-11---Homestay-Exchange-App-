import supabase from '../utils/supabase';

/**
 * Admin service for user management and verification
 */
export const adminService = {
  /**
   * Fetch all users with their profiles and documents
   */
  async getAllUsers() {
    try {
      // Get all user profiles
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch role-specific data for each user
      const usersWithDetails = await Promise.all(
        userProfiles.map(async (profile) => {
          let roleSpecificData = {};

          if (profile.role === 'host') {
            const { data: hostProfile } = await supabase
              .from('host_profiles')
              .select('*')
              .eq('user_id', profile.id)
              .maybeSingle();

            roleSpecificData = hostProfile || {};
          } else if (profile.role === 'guest') {
            const { data: guestProfile } = await supabase
              .from('guest_profiles')
              .select('*')
              .eq('user_id', profile.id)
              .maybeSingle();

            roleSpecificData = guestProfile || {};
          }

          // Get arrangement count
          const { count: arrangementCount } = await supabase
            .from('facilitation_requests')
            .select('*', { count: 'exact', head: true })
            .or(
              profile.role === 'host'
                ? `host_id.eq.${profile.id}`
                : `guest_id.eq.${profile.id}`
            )
            .eq('status', 'approved');

          return {
            id: profile.id,
            fullName: profile.full_name,
            email: profile.email,
            phone: profile.phone_number,
            userType: profile.role,
            status: profile.is_verified ? 'verified' : 'pending',
            memberSince: profile.created_at,
            rating: roleSpecificData.average_rating || null,
            totalArrangements: arrangementCount || 0,
            documentsSubmitted: !!(
              roleSpecificData.id_document_url ||
              roleSpecificData.proof_of_address_url ||
              roleSpecificData.student_id_url
            ),
            // Host-specific fields
            address: roleSpecificData.address || null,
            postcode: roleSpecificData.postcode || null,
            // Student-specific fields
            university: roleSpecificData.university || null,
            course: roleSpecificData.course || null,
            yearOfStudy: roleSpecificData.year_of_study || null,
            // Document URLs
            idDocumentUrl: roleSpecificData.id_document_url || null,
            proofOfAddressUrl: roleSpecificData.proof_of_address_url || null,
            studentIdUrl: roleSpecificData.student_id_url || null,
            dbsCheckUrl: roleSpecificData.dbs_check_url || null,
            // Full profile data
            profileData: roleSpecificData,
          };
        })
      );

      return usersWithDetails;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Verify a user (set is_verified to true)
   */
  async verifyUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_verified: true })
        .eq('id', userId);

      if (error) throw error;

      // TODO: Send verification email notification
      console.log(`User ${userId} verified successfully`);
      return { success: true };
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  },

  /**
   * Reject a user verification (currently just sets is_verified to false)
   * TODO: Add rejection_reason field to database schema
   */
  async rejectUser(userId, reason) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_verified: false,
          // TODO: Add rejection_reason field when schema is updated
        })
        .eq('id', userId);

      if (error) throw error;

      // TODO: Send rejection email with reason
      console.log(`User ${userId} rejected. Reason: ${reason}`);
      return { success: true, reason };
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  },

  /**
   * Suspend a user account
   * TODO: Add is_suspended and suspension_reason fields to database schema
   */
  async suspendUser(userId, reason) {
    try {
      // For now, we can use is_verified = false to simulate suspension
      // Later, add dedicated is_suspended field
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_verified: false,
          // TODO: Add is_suspended and suspension_reason when schema is updated
        })
        .eq('id', userId);

      if (error) throw error;

      console.log(`User ${userId} suspended. Reason: ${reason}`);
      return { success: true, reason };
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },

  /**
   * Delete a user permanently
   */
  async deleteUser(userId) {
    try {
      // First delete role-specific profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userProfile) {
        if (userProfile.role === 'host') {
          await supabase.from('host_profiles').delete().eq('user_id', userId);
        } else if (userProfile.role === 'guest') {
          await supabase.from('guest_profiles').delete().eq('user_id', userId);
        }
      }

      // Delete user profile
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      console.log(`User ${userId} deleted successfully`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Get verification statistics
   */
  async getVerificationStats() {
    try {
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('is_verified, role');

      if (error) throw error;

      const stats = {
        total: users.length,
        verified: users.filter(u => u.is_verified).length,
        pending: users.filter(u => !u.is_verified).length,
        hosts: users.filter(u => u.role === 'host').length,
        students: users.filter(u => u.role === 'guest').length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      throw error;
    }
  },

  /**
   * Export users to CSV format
   */
  async exportUsersToCSV() {
    try {
      const users = await this.getAllUsers();

      // Create CSV header
      const headers = [
        'Name',
        'Email',
        'Phone',
        'Type',
        'Status',
        'Member Since',
        'Rating',
        'Arrangements',
      ];

      // Create CSV rows
      const rows = users.map(user => [
        user.fullName,
        user.email,
        user.phone,
        user.userType,
        user.status,
        new Date(user.memberSince).toLocaleDateString('en-GB'),
        user.rating || 'N/A',
        user.totalArrangements,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting users:', error);
      throw error;
    }
  },
};
