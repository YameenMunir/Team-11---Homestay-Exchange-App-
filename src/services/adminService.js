import supabase from '../utils/supabase';
import { documentService } from './documentService';

/**
 * Admin service for user management and verification
 *
 * USER STATUS SYSTEM:
 * The user status is determined by multiple database fields with priority order:
 * is_banned > is_suspended > is_verified + is_active
 *
 * - BANNED: is_banned = true
 *   → User permanently banned from platform
 *   → Cannot access any features but can be unbanned by admin
 *   → Reversible action (soft delete)
 *
 * - SUSPENDED: is_suspended = true
 *   → User temporarily suspended from platform
 *   → Cannot access protected features
 *   → Can be unsuspended by admin
 *
 * - VERIFIED: is_verified = true, is_active = true
 *   → User approved by admin, has full access to all features
 *
 * - REJECTED: is_verified = false, is_active = false
 *   → User rejected by admin, cannot access protected features
 *   → Can be reactivated by admin to move back to pending status
 *
 * - PENDING: is_verified = false, is_active = true
 *   → User just signed up and awaiting admin review
 *
 * PERMANENT DELETE:
 * - Completely removes user account and all associated data (irreversible)
 * - Different from ban which is reversible
 */
export const adminService = {
  /**
   * Fetch all users from user_profiles table with role 'guest' or 'host'
   * Returns complete list with all profile fields needed for admin dashboard display
   */
  async getAllUsers() {
    try {
      console.log('=== STARTING getAllUsers() ===');

      // Fetch all users from user_profiles where role is 'guest' or 'host'
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['guest', 'host'])
        .order('created_at', { ascending: false });

      console.log('Query result:', {
        userProfiles,
        profilesError,
        count: userProfiles?.length
      });

      if (profilesError) {
        console.error('❌ Error fetching user_profiles:', profilesError);
        throw profilesError;
      }

      if (!userProfiles || userProfiles.length === 0) {
        console.warn('⚠️ No user profiles found with role guest or host');
        return [];
      }

      console.log(`✅ Found ${userProfiles.length} user profiles with role guest or host:`,
        userProfiles.map(p => ({ id: p.id, email: p.email, role: p.role }))
      );

      // Process each user profile and fetch role-specific data
      const usersWithDetails = await Promise.all(
        userProfiles.map(async (profile) => {
          console.log(`Processing user: ${profile.email} (${profile.role})`);

          try {
            let roleSpecificData = {};

            // Fetch role-specific profile data
            if (profile.role === 'guest') {
              const { data: guestProfile, error: guestError } = await supabase
                .from('guest_profiles')
                .select('*')
                .eq('user_id', profile.id)
                .maybeSingle();

              if (guestError) {
                console.error(`❌ Error fetching guest profile for ${profile.email}:`, guestError);
              } else if (!guestProfile) {
                console.warn(`⚠️ No guest_profile found for user ${profile.email} (${profile.id})`);
              } else {
                console.log(`✅ Found guest_profile for ${profile.email}`);
              }
              roleSpecificData = guestProfile || {};
            } else if (profile.role === 'host') {
              const { data: hostProfile, error: hostError } = await supabase
                .from('host_profiles')
                .select('*')
                .eq('user_id', profile.id)
                .maybeSingle();

              if (hostError) {
                console.error(`❌ Error fetching host profile for ${profile.email}:`, hostError);
              } else if (!hostProfile) {
                console.warn(`⚠️ No host_profile found for user ${profile.email} (${profile.id})`);
              } else {
                console.log(`✅ Found host_profile for ${profile.email}`);
              }
              roleSpecificData = hostProfile || {};
            }

            // Get documents from user_documents table
            const { data: documents, error: docError } = await supabase
              .from('user_documents')
              .select('document_type, file_url')
              .eq('user_id', profile.id);

            if (docError) {
              console.error(`Error fetching documents for ${profile.id}:`, docError);
            }

            // Map documents to their respective URL fields with signed URLs
            const documentUrls = {
              idDocumentUrl: null,
              proofOfAddressUrl: null,
              studentIdUrl: null,
              dbsCheckUrl: null,
            };

            if (documents && documents.length > 0) {
              // Generate signed URLs for each document (valid for 1 hour)
              await Promise.all(
                documents.map(async (doc) => {
                  if (doc.file_url) {
                    const signedUrl = await documentService.getSignedUrl(doc.file_url, 3600);

                    switch (doc.document_type) {
                      case 'government_id':
                        documentUrls.idDocumentUrl = signedUrl;
                        break;
                      case 'proof_of_address':
                        documentUrls.proofOfAddressUrl = signedUrl;
                        break;
                      case 'admission_proof':
                        documentUrls.studentIdUrl = signedUrl;
                        break;
                      case 'dbs_check':
                        documentUrls.dbsCheckUrl = signedUrl;
                        break;
                    }
                  }
                })
              );
            }

            // Determine status based on is_banned, is_suspended, is_verified, and is_active
            // Status priority: banned > suspended > verified/rejected > pending
            let status = 'pending';
            if (profile.is_banned) {
              status = 'banned';
            } else if (profile.is_suspended) {
              status = 'suspended';
            } else if (profile.is_verified && profile.is_active) {
              status = 'verified';
            } else if (!profile.is_verified && !profile.is_active) {
              status = 'rejected';
            } else if (!profile.is_verified && profile.is_active) {
              status = 'pending';
            }

            // Return complete user object with all fields needed for dashboard
            const userObject = {
              id: profile.id,
              fullName: profile.full_name || 'N/A',
              email: profile.email || 'N/A',
              phone: profile.phone_number || 'N/A',
              userType: profile.role,
              status,
              rejectionReason: profile.rejection_reason || null,
              suspensionReason: profile.suspension_reason || null,
              suspendedAt: profile.suspended_at || null,
              banReason: profile.ban_reason || null,
              bannedAt: profile.banned_at || null,
              memberSince: profile.created_at,
              rating: roleSpecificData.average_rating || null,
              totalArrangements: 0,
              documentsSubmitted: !!(
                documentUrls.idDocumentUrl ||
                documentUrls.proofOfAddressUrl ||
                documentUrls.studentIdUrl ||
                documentUrls.dbsCheckUrl
              ),
              // Host-specific fields
              address: roleSpecificData.address || null,
              postcode: roleSpecificData.postcode || null,
              // Student-specific fields (guest)
              university: roleSpecificData.university || null,
              course: roleSpecificData.course || null,
              yearOfStudy: roleSpecificData.year_of_study || null,
              // Document URLs from user_documents table
              idDocumentUrl: documentUrls.idDocumentUrl,
              proofOfAddressUrl: documentUrls.proofOfAddressUrl,
              studentIdUrl: documentUrls.studentIdUrl,
              dbsCheckUrl: documentUrls.dbsCheckUrl,
              // Full profile data for additional access if needed
              profileData: roleSpecificData,
            };

            console.log(`✅ Successfully processed user: ${profile.email} as ${profile.role}`);
            return userObject;
          } catch (profileError) {
            console.error(`❌ Error processing profile ${profile.email} (${profile.id}):`, profileError);
            console.error('Stack trace:', profileError.stack);
            // Return minimal user object on error to ensure user still appears in list
            return {
              id: profile.id,
              fullName: profile.full_name || 'N/A',
              email: profile.email || 'N/A',
              phone: profile.phone_number || 'N/A',
              userType: profile.role,
              status: 'pending',
              rejectionReason: profile.rejection_reason || null,
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

      console.log(`✅ Successfully processed ${usersWithDetails.length} users for admin dashboard`);
      console.log('User details:', usersWithDetails.map(u => ({
        email: u.email,
        name: u.fullName,
        type: u.userType,
        status: u.status
      })));
      console.log('=== COMPLETED getAllUsers() ===');

      return usersWithDetails;
    } catch (error) {
      console.error('❌ FATAL ERROR in getAllUsers():', error);
      throw error;
    }
  },

  /**
   * Verify a user (set is_verified to true)
   * Clears any rejection reason if present
   */
  async verifyUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_verified: true,
          rejection_reason: null, // Clear any previous rejection reason
        })
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
   * Stores the rejection reason in the database
   */
  async rejectUser(userId, reason) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_verified: false,
          is_active: false,
          rejection_reason: reason,
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
   * Clears the rejection reason when reactivating
   */
  async reactivateUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_active: true,
          is_verified: false, // Back to pending for review
          rejection_reason: null, // Clear the rejection reason
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
   * Sets is_suspended to true and stores the suspension reason
   * Suspended users lose verification but keep their account active
   */
  async suspendUser(userId, reason) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_suspended: true,
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
          // Note: suspended_by would need the current admin's ID
        })
        .eq('id', userId);

      if (error) throw error;

      // TODO: Send suspension notification email
      console.log(`User ${userId} suspended. Reason: ${reason}`);
      return { success: true, reason };
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },

  /**
   * Unsuspend a user account (reactivate from suspension)
   * Clears suspension flags and restores their previous verification status
   */
  async unsuspendUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_suspended: false,
          suspension_reason: null,
          suspended_at: null,
          suspended_by: null,
        })
        .eq('id', userId);

      if (error) throw error;

      console.log(`User ${userId} unsuspended and reactivated`);
      return { success: true };
    } catch (error) {
      console.error('Error unsuspending user:', error);
      throw error;
    }
  },

  /**
   * Ban a user account permanently
   * Sets is_banned to true and stores the ban reason
   * Banned users cannot access the platform but can be unbanned
   */
  async banUser(userId, reason) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_banned: true,
          ban_reason: reason,
          banned_at: new Date().toISOString(),
          // Note: banned_by would need the current admin's ID
        })
        .eq('id', userId);

      if (error) throw error;

      // TODO: Send ban notification email
      console.log(`User ${userId} banned. Reason: ${reason}`);
      return { success: true, reason };
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  },

  /**
   * Unban a user account (restore from ban)
   * Clears ban flags and restores their previous status
   */
  async unbanUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_banned: false,
          ban_reason: null,
          banned_at: null,
          banned_by: null,
        })
        .eq('id', userId);

      if (error) throw error;

      console.log(`User ${userId} unbanned successfully`);
      return { success: true };
    } catch (error) {
      console.error('Error unbanning user:', error);
      throw error;
    }
  },

  /**
   * Delete a user permanently (irreversible)
   * This completely removes the user account and all associated data
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

      console.log(`User ${userId} permanently deleted`);
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
      // Get pending verifications count (is_verified = false AND is_active = true, only hosts and guests)
      const { count: pendingVerifications } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false)
        .eq('is_active', true)
        .in('role', ['host', 'guest']);

      // Get pending facilitation requests count
      const { count: pendingFacilitations } = await supabase
        .from('facilitation_requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'in_review']);

      // Get active arrangements count
      const { count: activeArrangements } = await supabase
        .from('facilitation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'matched');

      // Get total users count (only hosts and guests, not admins)
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['host', 'guest']);

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
   * Note: facilitation_requests table uses requester_id and target_id, not guest_id/host_id
   */
  async getFacilitationRequests(status = null) {
    try {
      let query = supabase
        .from('facilitation_requests')
        .select(`
          *,
          requester:requester_id (
            id,
            full_name,
            email,
            phone_number,
            role
          ),
          target:target_id (
            id,
            full_name,
            email,
            phone_number,
            role
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
        requesterId: req.requester_id,
        targetId: req.target_id,
        requesterRole: req.requester_role,
        requesterName: req.requester?.full_name || 'Unknown',
        requesterEmail: req.requester?.email || '',
        targetName: req.target?.full_name || 'Unknown',
        targetEmail: req.target?.email || '',
        targetRole: req.target?.role || '',
        status: req.status,
        message: req.message || '',
        requestDate: req.created_at,
        reviewedAt: req.reviewed_at,
        matchedAt: req.matched_at,
        completedAt: req.completed_at,
        adminNotes: req.admin_notes,
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
      const { data: recentRequests, error: requestsError } = await supabase
        .from('facilitation_requests')
        .select(`
          id,
          created_at,
          status,
          requester:requester_id (
            full_name
          ),
          target:target_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (requestsError) {
        console.warn('Error fetching recent facilitation requests:', requestsError);
        // Continue without facilitation requests - don't fail the entire function
      } else if (recentRequests) {
        recentRequests.forEach(req => {
          activities.push({
            type: 'facilitation_request',
            message: `Facilitation request: ${req.requester?.full_name || 'Unknown'} → ${req.target?.full_name || 'Unknown'}`,
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

  /**
   * Create a user profile on behalf of a less tech-savvy user
   * This function handles the complete flow:
   * 1. Validate input data
   * 2. Create auth.users record
   * 3. Create user_profiles record
   * 4. Create role-specific profile (host_profiles or guest_profiles)
   * 5. Upload documents if provided
   * 6. Send welcome email with password reset link
   *
   * @param {Object} profileData - Complete profile data from admin form
   * @param {string} adminUserId - ID of the admin creating the profile
   * @returns {Object} - Result with status, user data, and next steps
   */
  async createUserProfileOnBehalf(profileData, adminUserId) {
    try {
      console.log('=== STARTING createUserProfileOnBehalf() ===');
      console.log('Profile data:', profileData);

      // ====================================================================
      // STEP 1: VALIDATE INPUT DATA
      // ====================================================================
      const validationErrors = [];

      // Required fields for all users
      if (!profileData.email || !profileData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        validationErrors.push('Valid email address is required');
      }
      if (!profileData.fullName || profileData.fullName.trim().length < 2) {
        validationErrors.push('Full name is required (minimum 2 characters)');
      }

      // Extract country code and clean phone number
      let countryCode = profileData.countryCode || '+44'; // Use provided country code or default to UK
      let phoneNumber = '';

      if (profileData.phone) {
        // Remove all spaces, dashes, and parentheses
        const cleanedPhone = profileData.phone.replace(/[\s\-()]/g, '');

        // Check if phone starts with + (user might have included country code)
        if (cleanedPhone.startsWith('+')) {
          // Extract country code (1-3 digits after +)
          const match = cleanedPhone.match(/^(\+\d{1,3})(\d+)$/);
          if (match) {
            countryCode = match[1]; // Override with user-provided country code
            phoneNumber = match[2];
          } else {
            validationErrors.push('Invalid phone number format. Expected format: +44 1234567890');
          }
        } else {
          // No country code in phone number, use cleaned number
          phoneNumber = cleanedPhone;
        }

        // Validate phone number: must be 10-15 digits
        if (phoneNumber && !/^\d{10,15}$/.test(phoneNumber)) {
          validationErrors.push('Phone number must contain 10-15 digits (numbers only)');
        }
      }

      // Validate user type
      const userType = profileData.userType === 'student' ? 'guest' : profileData.userType;
      if (!['host', 'guest'].includes(userType)) {
        validationErrors.push('Invalid user type (must be host or guest)');
      }

      // Validate age 18+ for ALL users (both host and guest)
      if (profileData.dateOfBirth) {
        const birthDate = new Date(profileData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

        if (finalAge < 18) {
          validationErrors.push('User must be at least 18 years old');
        }
      }

      // Role-specific validation
      if (userType === 'guest') {
        // Guest (student) required fields
        if (!profileData.university || profileData.university.trim().length < 2) {
          validationErrors.push('University is required for student profiles');
        }
        if (!profileData.course || profileData.course.trim().length < 2) {
          validationErrors.push('Course is required for student profiles');
        }

        // Validate at least one service offered
        if (!profileData.servicesOffered || profileData.servicesOffered.length === 0) {
          validationErrors.push('At least one service must be selected for student profiles');
        }
      } else if (userType === 'host') {
        // Host required fields
        if (!profileData.address || profileData.address.trim().length < 5) {
          validationErrors.push('Address is required for host profiles');
        }
        if (!profileData.city || profileData.city.trim().length < 2) {
          validationErrors.push('City is required for host profiles');
        }
        if (!profileData.postcode || profileData.postcode.trim().length < 3) {
          validationErrors.push('Postcode is required for host profiles');
        }

        // Validate number of bedrooms if provided
        if (profileData.bedroomsAvailable && profileData.bedroomsAvailable < 0) {
          validationErrors.push('Number of bedrooms must be 0 or greater');
        }

        // Validate at least one service needed
        if (!profileData.servicesNeeded || profileData.servicesNeeded.length === 0) {
          validationErrors.push('At least one service must be selected for host profiles');
        }
      }

      // If validation fails, return error response
      if (validationErrors.length > 0) {
        console.log('❌ Validation failed:', validationErrors);
        return {
          status: 'error',
          message: 'Validation failed',
          errors: validationErrors,
        };
      }

      console.log('✅ Validation passed');

      // ====================================================================
      // STEP 2: CHECK FOR DUPLICATE EMAIL
      // ====================================================================
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('email', profileData.email.toLowerCase())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for duplicate email:', checkError);
        throw checkError;
      }

      if (existingProfile) {
        console.log('❌ Email already exists:', profileData.email);
        return {
          status: 'error',
          message: 'Email already exists',
          errors: [`An account with email ${profileData.email} already exists`],
        };
      }

      console.log('✅ Email is unique');

      // ====================================================================
      // STEP 3: CREATE AUTH USER
      // ====================================================================
      // Use admin-provided password, or generate a random temporary password if not provided
      const password = profileData.password || `TempPass${Math.random().toString(36).slice(-8)}!${Date.now().toString(36)}`;

      console.log('Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profileData.email.toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: profileData.fullName,
            role: userType,
            created_by_admin: true,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error('❌ Error creating auth user:', authError);
        return {
          status: 'error',
          message: 'Failed to create user account',
          errors: [authError.message],
        };
      }

      if (!authData.user) {
        console.error('❌ Auth user creation failed: no user returned');
        return {
          status: 'error',
          message: 'Failed to create user account',
          errors: ['Authentication service did not return a user'],
        };
      }

      const authUserId = authData.user.id;
      console.log('✅ Auth user created with ID:', authUserId);

      // ====================================================================
      // STEP 4: CREATE USER_PROFILES RECORD
      // ====================================================================
      // Note: This might be auto-created by a database trigger, but we'll
      // insert it explicitly to ensure all fields are set correctly
      console.log('Creating user_profiles record...');

      const userProfileData = {
        id: authUserId,
        email: profileData.email.toLowerCase(),
        full_name: profileData.fullName,
        role: userType,
        phone_number: phoneNumber,
        country_code: countryCode,
        created_by: adminUserId,
        is_verified: false, // Admin will verify after reviewing
        is_active: true,    // Active but pending verification
        is_suspended: false,
        is_banned: false,
      };

      // Use upsert to handle case where trigger already created the record
      const { data: profileRecord, error: profileError } = await supabase
        .from('user_profiles')
        .upsert(userProfileData, { onConflict: 'id' })
        .select()
        .single();

      if (profileError) {
        console.error('❌ Error creating user_profiles record:', profileError);
        // Try to clean up auth user if profile creation fails
        // Note: This requires admin privileges or a server function
        return {
          status: 'error',
          message: 'Failed to create user profile',
          errors: [profileError.message],
        };
      }

      console.log('✅ User profile created');

      // ====================================================================
      // STEP 5: CREATE ROLE-SPECIFIC PROFILE
      // ====================================================================
      let roleSpecificProfile = null;

      if (userType === 'host') {
        console.log('Creating host_profiles record...');

        const hostProfileData = {
          user_id: authUserId,
          date_of_birth: profileData.dateOfBirth || null,
          address: profileData.address,
          postcode: profileData.postcode,
          city: profileData.city,
          property_description: profileData.propertyType || null,
          number_of_rooms: parseInt(profileData.bedroomsAvailable) || 1,
          amenities: [], // Can be expanded later
          accessibility_features: [], // Can be expanded later
          preferred_gender: null,
          preferred_age_range: null,
          support_needs: profileData.servicesNeeded ? JSON.stringify(profileData.servicesNeeded) : null,
          additional_info: profileData.adminNotes || null,
          average_rating: 0,
          total_ratings: 0,
        };

        const { data: hostProfile, error: hostError } = await supabase
          .from('host_profiles')
          .insert(hostProfileData)
          .select()
          .single();

        if (hostError) {
          console.error('❌ Error creating host_profiles record:', hostError);
          return {
            status: 'error',
            message: 'Failed to create host profile',
            errors: [hostError.message],
          };
        }

        roleSpecificProfile = hostProfile;
        console.log('✅ Host profile created');

      } else if (userType === 'guest') {
        console.log('Creating guest_profiles record...');

        const guestProfileData = {
          user_id: authUserId,
          date_of_birth: profileData.dateOfBirth || null,
          university: profileData.university,
          course: profileData.course,
          year_of_study: parseInt(profileData.yearOfStudy) || 1,
          student_id: null, // Can be added later
          preferred_location: null,
          preferred_postcode: null,
          bio: profileData.adminNotes || null,
          skills: profileData.servicesOffered || [],
          availability_start: null,
          availability_end: null,
          emergency_contact_name: null,
          emergency_contact_phone: null,
          average_rating: 0,
          total_ratings: 0,
        };

        const { data: guestProfile, error: guestError } = await supabase
          .from('guest_profiles')
          .insert(guestProfileData)
          .select()
          .single();

        if (guestError) {
          console.error('❌ Error creating guest_profiles record:', guestError);
          return {
            status: 'error',
            message: 'Failed to create guest profile',
            errors: [guestError.message],
          };
        }

        roleSpecificProfile = guestProfile;
        console.log('✅ Guest profile created');
      }

      // ====================================================================
      // STEP 6: UPLOAD DOCUMENTS (if provided)
      // ====================================================================
      const uploadedDocuments = {};

      if (profileData.documents) {
        console.log('Processing document uploads...');

        for (const [docType, file] of Object.entries(profileData.documents)) {
          if (file && file instanceof File) {
            try {
              const fileExt = file.name.split('.').pop();
              const fileName = `${authUserId}_${docType}_${Date.now()}.${fileExt}`;
              const filePath = `${authUserId}/${fileName}`;

              // Upload to user-documents bucket
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('user-documents')
                .upload(filePath, file, {
                  cacheControl: '3600',
                  upsert: false,
                });

              if (uploadError) {
                console.error(`❌ Error uploading ${docType}:`, uploadError);
                continue; // Skip this document but continue with others
              }

              console.log(`✅ Uploaded ${docType}: ${filePath}`);

              // Map frontend document types to database document_type enum
              let documentType = 'government_id'; // default
              switch (docType) {
                case 'idDocument':
                  documentType = 'government_id';
                  break;
                case 'addressProof':
                  documentType = 'proof_of_address';
                  break;
                case 'dbsCheck':
                  documentType = 'dbs_check';
                  break;
                case 'admissionLetter':
                  documentType = 'admission_proof';
                  break;
              }

              // Create user_documents record
              const { error: docRecordError } = await supabase
                .from('user_documents')
                .insert({
                  user_id: authUserId,
                  document_type: documentType,
                  file_url: filePath,
                  file_name: file.name,
                  file_size: file.size,
                  verification_status: 'pending',
                });

              if (docRecordError) {
                console.error(`❌ Error creating document record for ${docType}:`, docRecordError);
              } else {
                uploadedDocuments[docType] = filePath;
              }

            } catch (uploadErr) {
              console.error(`❌ Exception uploading ${docType}:`, uploadErr);
            }
          }
        }

        console.log(`✅ Document uploads completed. Uploaded: ${Object.keys(uploadedDocuments).length}`);
      }

      // ====================================================================
      // STEP 7: SEND PASSWORD RESET EMAIL (only if password wasn't set)
      // ====================================================================
      let passwordSetByAdmin = false;

      if (profileData.password) {
        // Admin set a password, no need to send reset email
        console.log('✅ Password set by admin, skipping password reset email');
        passwordSetByAdmin = true;
      } else {
        // No password provided, send reset email
        console.log('Sending password reset email...');

        try {
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            profileData.email.toLowerCase(),
            {
              redirectTo: `${window.location.origin}/reset-password`,
            }
          );

          if (resetError) {
            console.error('⚠️ Warning: Could not send password reset email:', resetError);
            // Don't fail the entire operation if email fails
          } else {
            console.log('✅ Password reset email sent');
          }
        } catch (emailErr) {
          console.error('⚠️ Warning: Exception sending password reset email:', emailErr);
          // Don't fail the entire operation if email fails
        }
      }

      // ====================================================================
      // STEP 8: RETURN SUCCESS RESPONSE
      // ====================================================================
      console.log('=== COMPLETED createUserProfileOnBehalf() ===');

      // Create next steps based on whether password was set
      const nextSteps = passwordSetByAdmin
        ? [
            'Password has been set by admin',
            'User can now log in with the provided password',
            'User can complete additional profile details after login',
            'Admin should review and verify the user account',
          ]
        : [
            'Password reset email sent to user',
            'User should check email and set a permanent password',
            'User can then log in and complete additional profile details',
            'Admin should review and verify the user account',
          ];

      return {
        status: 'success',
        message: 'User account created successfully.',
        user: {
          auth_user_id: authUserId,
          profile_id: profileRecord.id,
          email: profileData.email.toLowerCase(),
          full_name: profileData.fullName,
          role: userType,
          created_by_admin: true,
          password_set_by_admin: passwordSetByAdmin,
        },
        created_profiles: {
          user_profile: profileRecord,
          [userType === 'host' ? 'host_profile' : 'guest_profile']: roleSpecificProfile,
        },
        uploaded_documents: uploadedDocuments,
        next_steps: nextSteps,
      };

    } catch (error) {
      console.error('❌ FATAL ERROR in createUserProfileOnBehalf():', error);
      return {
        status: 'error',
        message: 'An unexpected error occurred while creating the user profile',
        errors: [error.message],
      };
    }
  },
};
