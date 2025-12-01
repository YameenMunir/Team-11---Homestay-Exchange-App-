import supabase from '../utils/supabase';

/**
 * Admin service for user management and verification
 *
 * USER STATUS SYSTEM:
 * The user status is determined by two database fields: is_verified and is_active
 *
 * - PENDING: is_verified = false, is_active = true
 *   → User just signed up and awaiting admin review
 *
 * - VERIFIED: is_verified = true, is_active = true
 *   → User approved by admin, has full access to all features
 *
 * - REJECTED: is_verified = false, is_active = false
 *   → User rejected by admin, cannot access protected features
 *   → Can be reactivated by admin to move back to pending status
 *
 * - SUSPENDED: Similar to rejected but for different reason
 *   → Future enhancement will add is_suspended field
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

      if (profilesError) {
        console.error('Error fetching user_profiles:', profilesError);
        throw profilesError;
      }

      if (!userProfiles || userProfiles.length === 0) {
        console.log('No user profiles found');
        return [];
      }

      // Fetch role-specific data for each user
      const usersWithDetails = await Promise.all(
        userProfiles.map(async (profile) => {
          try {
            let roleSpecificData = {};

            if (profile.role === 'host') {
              const { data: hostProfile, error: hostError } = await supabase
                .from('host_profiles')
                .select('*')
                .eq('user_id', profile.id)
                .maybeSingle();

              if (hostError) console.error(`Error fetching host profile for ${profile.id}:`, hostError);
              roleSpecificData = hostProfile || {};
            } else if (profile.role === 'guest') {
              const { data: guestProfile, error: guestError } = await supabase
                .from('guest_profiles')
                .select('*')
                .eq('user_id', profile.id)
                .maybeSingle();

              if (guestError) console.error(`Error fetching guest profile for ${profile.id}:`, guestError);
              roleSpecificData = guestProfile || {};
            }

            // Get documents from user_documents table
            const { data: documents, error: docError } = await supabase
              .from('user_documents')
              .select('document_type, file_url')
              .eq('user_id', profile.id);

            if (docError) console.error(`Error fetching documents for ${profile.id}:`, docError);

          // Map documents to their respective URL fields
          const documentUrls = {
            idDocumentUrl: null,
            proofOfAddressUrl: null,
            studentIdUrl: null,
            dbsCheckUrl: null,
          };

          if (documents && documents.length > 0) {
            documents.forEach(doc => {
              switch (doc.document_type) {
                case 'government_id':
                  documentUrls.idDocumentUrl = doc.file_url;
                  break;
                case 'proof_of_address':
                  documentUrls.proofOfAddressUrl = doc.file_url;
                  break;
                case 'admission_proof':
                  documentUrls.studentIdUrl = doc.file_url;
                  break;
                case 'dbs_check':
                  documentUrls.dbsCheckUrl = doc.file_url;
                  break;
              }
            });
          }

          // Get arrangement count - simplified to avoid errors
          let arrangementCount = 0;

            // Determine status based on is_verified and is_active
            let status = 'pending';
            if (profile.is_verified && profile.is_active) {
              status = 'verified';
            } else if (!profile.is_verified && !profile.is_active) {
              status = 'rejected';
            } else if (!profile.is_verified && profile.is_active) {
              status = 'pending';
            }

            return {
              id: profile.id,
              fullName: profile.full_name,
              email: profile.email,
              phone: profile.phone_number,
              userType: profile.role,
              status,
              memberSince: profile.created_at,
              rating: roleSpecificData.average_rating || null,
              totalArrangements: arrangementCount || 0,
              documentsSubmitted: !!(
                documentUrls.idDocumentUrl ||
                documentUrls.proofOfAddressUrl ||
                documentUrls.studentIdUrl ||
                documentUrls.dbsCheckUrl
              ),
              // Host-specific fields
              address: roleSpecificData.address || null,
              postcode: roleSpecificData.postcode || null,
              // Student-specific fields
              university: roleSpecificData.university || null,
              course: roleSpecificData.course || null,
              yearOfStudy: roleSpecificData.year_of_study || null,
              // Document URLs from user_documents table
              idDocumentUrl: documentUrls.idDocumentUrl,
              proofOfAddressUrl: documentUrls.proofOfAddressUrl,
              studentIdUrl: documentUrls.studentIdUrl,
              dbsCheckUrl: documentUrls.dbsCheckUrl,
              // Full profile data
              profileData: roleSpecificData,
            };
          } catch (profileError) {
            console.error(`Error processing profile ${profile.id}:`, profileError);
            // Return a basic user object even if there's an error
            return {
              id: profile.id,
              fullName: profile.full_name,
              email: profile.email,
              phone: profile.phone_number,
              userType: profile.role,
              status: 'pending',
              memberSince: profile.created_at,
              rating: null,
              totalArrangements: 0,
              documentsSubmitted: false,
              address: null,
              postcode: null,
              university: null,
              course: null,
              yearOfStudy: null,
              idDocumentUrl: null,
              proofOfAddressUrl: null,
              studentIdUrl: null,
              dbsCheckUrl: null,
              profileData: {},
            };
          }
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
   * Reject a user verification
   * Sets is_verified to false and is_active to false to mark as rejected
   */
  async rejectUser(userId, reason) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_verified: false,
          is_active: false,
          // TODO: Add rejection_reason field when schema is updated
          // For now, reason is passed but not stored in DB
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
   * Reactivate a rejected user (set them back to pending status)
   * This allows users to reapply after addressing rejection reasons
   */
  async reactivateUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_active: true,
          is_verified: false, // Back to pending for review
        })
        .eq('id', userId);

      if (error) throw error;

      console.log(`User ${userId} reactivated and set to pending status`);
      return { success: true };
    } catch (error) {
      console.error('Error reactivating user:', error);
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

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Get pending verifications count
      const { count: pendingVerifications } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false);

      // Get pending facilitation requests count
      const { count: pendingFacilitations } = await supabase
        .from('facilitation_requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'under_review']);

      // Get active arrangements count
      const { count: activeArrangements } = await supabase
        .from('facilitation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total hosts and students
      const { count: totalHosts } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'host');

      const { count: totalStudents } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'guest');

      return {
        pendingVerifications: pendingVerifications || 0,
        pendingFacilitations: pendingFacilitations || 0,
        activeArrangements: activeArrangements || 0,
        totalUsers: totalUsers || 0,
        totalHosts: totalHosts || 0,
        totalStudents: totalStudents || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get all facilitation requests
   */
  async getFacilitationRequests(status = null) {
    try {
      let query = supabase
        .from('facilitation_requests')
        .select(`
          *,
          host:host_id (
            id,
            user_id,
            address,
            postcode,
            user_profiles!inner (id, full_name, email, phone_number)
          ),
          guest:guest_id (
            id,
            user_id,
            university,
            course,
            user_profiles!inner (id, full_name, email, phone_number)
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Format the data
      return data.map(req => ({
        id: req.id,
        hostId: req.host_id,
        guestId: req.guest_id,
        hostName: req.host?.user_profiles?.full_name || 'Unknown Host',
        hostEmail: req.host?.user_profiles?.email || '',
        hostAddress: req.host?.address || '',
        guestName: req.guest?.user_profiles?.full_name || 'Unknown Student',
        guestEmail: req.guest?.user_profiles?.email || '',
        guestUniversity: req.guest?.university || '',
        guestCourse: req.guest?.course || '',
        status: req.status,
        servicesOffered: req.services_offered || [],
        requestDate: req.created_at,
        approvedDate: req.approved_at,
        rejectedDate: req.rejected_at,
        adminNotes: req.admin_notes,
        duration: req.duration_months,
      }));
    } catch (error) {
      console.error('Error fetching facilitation requests:', error);
      throw error;
    }
  },

  /**
   * Approve facilitation request
   */
  async approveFacilitationRequest(requestId, adminNotes = '') {
    try {
      const { error } = await supabase
        .from('facilitation_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          admin_notes: adminNotes,
        })
        .eq('id', requestId);

      if (error) throw error;

      // TODO: Send notification emails to both host and guest
      console.log(`Facilitation request ${requestId} approved`);
      return { success: true };
    } catch (error) {
      console.error('Error approving facilitation request:', error);
      throw error;
    }
  },

  /**
   * Reject facilitation request
   */
  async rejectFacilitationRequest(requestId, reason) {
    try {
      const { error } = await supabase
        .from('facilitation_requests')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          admin_notes: reason,
        })
        .eq('id', requestId);

      if (error) throw error;

      // TODO: Send notification emails to both host and guest
      console.log(`Facilitation request ${requestId} rejected. Reason: ${reason}`);
      return { success: true };
    } catch (error) {
      console.error('Error rejecting facilitation request:', error);
      throw error;
    }
  },

  /**
   * Get recent activity for dashboard
   */
  async getRecentActivity(limit = 10) {
    try {
      const activities = [];

      // Get recent user signups
      const { data: recentUsers } = await supabase
        .from('user_profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentUsers) {
        recentUsers.forEach(user => {
          activities.push({
            type: 'signup',
            message: `New ${user.role} signup: ${user.full_name}`,
            timestamp: user.created_at,
          });
        });
      }

      // Get recent facilitation requests
      const { data: recentRequests } = await supabase
        .from('facilitation_requests')
        .select(`
          id,
          created_at,
          status,
          guest:guest_id (
            user_profiles!inner (full_name)
          ),
          host:host_id (
            user_profiles!inner (full_name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentRequests) {
        recentRequests.forEach(req => {
          activities.push({
            type: 'facilitation_request',
            message: `Facilitation request: ${req.guest?.user_profiles?.full_name} → ${req.host?.user_profiles?.full_name}`,
            timestamp: req.created_at,
            status: req.status,
          });
        });
      }

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },
};
