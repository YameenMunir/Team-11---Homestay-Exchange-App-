import supabase from '../utils/supabase';

/**
 * Service for managing user profiles (guest and host)
 * Handles proper data formatting and validation
 */

export const profileService = {
  /**
   * Create or update guest profile
   * @param {Object} profileData - Guest profile data
   * @returns {Promise} Created/updated profile
   */
  async upsertGuestProfile(profileData) {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      const requiredFields = ['dateOfBirth', 'university', 'course', 'yearOfStudy'];
      const missingFields = requiredFields.filter(field => !profileData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate year of study
      if (profileData.yearOfStudy <= 0 || profileData.yearOfStudy > 10) {
        throw new Error('Year of study must be between 1 and 10');
      }

      // Validate age (must be 18+)
      const birthDate = new Date(profileData.dateOfBirth);
      const age = Math.floor((Date.now() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

      if (age < 18) {
        throw new Error('You must be at least 18 years old to register');
      }

      // Format data for Supabase (convert camelCase to snake_case)
      const formattedData = {
        user_id: user.id,
        date_of_birth: profileData.dateOfBirth,
        university: profileData.university.trim(),
        course: profileData.course.trim(),
        year_of_study: parseInt(profileData.yearOfStudy),
        student_id: profileData.studentId?.trim() || null,
        preferred_location: profileData.preferredLocation?.trim() || null,
        preferred_postcode: profileData.preferredPostcode?.trim() || null,
        bio: profileData.bio?.trim() || null,
        skills: profileData.skills || [],
        availability_start: profileData.availabilityStart || null,
        availability_end: profileData.availabilityEnd || null,
        available_hours: profileData.availableHours || [],
        hours_per_week: profileData.hoursPerWeek ? parseInt(profileData.hoursPerWeek) : null,
        profile_picture_url: profileData.profilePictureUrl || null,
        emergency_contact_name: profileData.emergencyContactName?.trim() || null,
        emergency_contact_phone: profileData.emergencyContactPhone?.trim() || null,
      };

      // Use upsert to handle both insert and update
      const { data, error } = await supabase
        .from('guest_profiles')
        .upsert(formattedData, {
          onConflict: 'user_id',
          returning: 'representation'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to save guest profile: ${error.message}`);
      }

      console.log('Guest profile saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in upsertGuestProfile:', error);
      throw error;
    }
  },

  /**
   * Create or update host profile
   * @param {Object} profileData - Host profile data
   * @returns {Promise} Created/updated profile
   */
  async upsertHostProfile(profileData) {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      const requiredFields = ['address', 'postcode', 'city', 'numberOfRooms'];
      const missingFields = requiredFields.filter(field => !profileData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate number of rooms
      if (profileData.numberOfRooms <= 0 || profileData.numberOfRooms > 50) {
        throw new Error('Number of rooms must be between 1 and 50');
      }

      // Format data for Supabase (convert camelCase to snake_case)
      const formattedData = {
        user_id: user.id,
        address: profileData.address.trim(),
        postcode: profileData.postcode.trim(),
        city: profileData.city.trim(),
        property_description: profileData.propertyDescription?.trim() || 'No description provided',
        number_of_rooms: parseInt(profileData.numberOfRooms),
        date_of_birth: profileData.dateOfBirth || null,
        amenities: profileData.amenities || [],
        accessibility_features: profileData.accessibilityFeatures || [],
        preferred_gender: profileData.preferredGender || null,
        preferred_age_range: profileData.preferredAgeRange || null,
        support_needs: profileData.supportNeeds?.trim() || null,
        additional_info: profileData.additionalInfo?.trim() || null,
        profile_picture_url: profileData.profilePictureUrl || null,
      };

      // Use upsert to handle both insert and update
      const { data, error } = await supabase
        .from('host_profiles')
        .upsert(formattedData, {
          onConflict: 'user_id',
          returning: 'representation'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to save host profile: ${error.message}`);
      }

      console.log('Host profile saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in upsertHostProfile:', error);
      throw error;
    }
  },

  /**
   * Get guest profile for current user
   * @returns {Promise} Guest profile data
   */
  async getGuestProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('guest_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching guest profile:', error);
      throw error;
    }
  },

  /**
   * Get host profile for current user
   * @returns {Promise} Host profile data
   */
  async getHostProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('host_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching host profile:', error);
      throw error;
    }
  },

  /**
   * Check if user has a profile (guest or host)
   * @returns {Promise} { hasGuestProfile: boolean, hasHostProfile: boolean }
   */
  async checkUserProfiles() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { hasGuestProfile: false, hasHostProfile: false };
      }

      const [guestResult, hostResult] = await Promise.all([
        supabase.from('guest_profiles').select('id').eq('user_id', user.id).single(),
        supabase.from('host_profiles').select('id').eq('user_id', user.id).single(),
      ]);

      return {
        hasGuestProfile: !guestResult.error,
        hasHostProfile: !hostResult.error,
      };
    } catch (error) {
      console.error('Error checking profiles:', error);
      return { hasGuestProfile: false, hasHostProfile: false };
    }
  },

  /**
   * Delete guest profile
   * @returns {Promise} Success status
   */
  async deleteGuestProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('guest_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting guest profile:', error);
      throw error;
    }
  },

  /**
   * Delete host profile
   * @returns {Promise} Success status
   */
  async deleteHostProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('host_profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting host profile:', error);
      throw error;
    }
  },
};

/**
 * Helper function to validate guest profile data
 * @param {Object} data - Profile data to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateGuestProfile = (data) => {
  const errors = [];

  // Required fields
  if (!data.dateOfBirth) errors.push('Date of birth is required');
  if (!data.university || data.university.trim() === '') errors.push('University is required');
  if (!data.course || data.course.trim() === '') errors.push('Course is required');
  if (!data.yearOfStudy) errors.push('Year of study is required');

  // Year of study validation
  if (data.yearOfStudy && (data.yearOfStudy < 1 || data.yearOfStudy > 10)) {
    errors.push('Year of study must be between 1 and 10');
  }

  // Age validation
  if (data.dateOfBirth) {
    const birthDate = new Date(data.dateOfBirth);
    const age = Math.floor((Date.now() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < 18) {
      errors.push('You must be at least 18 years old');
    }
  }

  // Availability dates validation
  if (data.availabilityStart && data.availabilityEnd) {
    const start = new Date(data.availabilityStart);
    const end = new Date(data.availabilityEnd);

    if (end < start) {
      errors.push('Availability end date must be after start date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Helper function to validate host profile data
 * @param {Object} data - Profile data to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateHostProfile = (data) => {
  const errors = [];

  // Required fields
  if (!data.address || data.address.trim() === '') errors.push('Address is required');
  if (!data.postcode || data.postcode.trim() === '') errors.push('Postcode is required');
  if (!data.city || data.city.trim() === '') errors.push('City is required');
  if (!data.numberOfRooms) errors.push('Number of rooms is required');

  // Number of rooms validation
  if (data.numberOfRooms && (data.numberOfRooms < 1 || data.numberOfRooms > 50)) {
    errors.push('Number of rooms must be between 1 and 50');
  }

  // Postcode format validation (basic UK postcode format)
  if (data.postcode && data.postcode.trim()) {
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    if (!postcodeRegex.test(data.postcode.trim())) {
      errors.push('Please enter a valid UK postcode');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default profileService;
