import supabase from '../utils/supabase';

/**
 * Service for host-related operations
 */
export const hostService = {
  // Expose supabase for direct auth access
  supabase,
  /**
   * Create a new host task
   * @param {Object} taskData - Task information
   * @returns {Promise} Created task data
   */
  async createTask(taskData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('host_tasks')
      .insert([
        {
          host_id: user.id,
          title: taskData.title,
          description: taskData.description,
          services_needed: taskData.servicesNeeded,
          hours_per_week: taskData.hoursPerWeek,
          frequency: taskData.frequency,
          schedule: taskData.schedule,
          duration: taskData.duration,
          compensation: taskData.compensation,
          requirements: taskData.requirements,
          additional_notes: taskData.additionalNotes,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all active tasks from verified hosts
   * @returns {Promise} Array of tasks with host information
   */
  async getActiveTasksWithHosts() {
    const { data, error } = await supabase
      .from('host_tasks')
      .select(`
        *,
        host:user_profiles!host_id (
          id,
          full_name,
          email,
          is_verified,
          host_profile:host_profiles!user_id (
            address,
            city,
            postcode,
            property_description,
            amenities,
            accessibility_features,
            profile_picture_url,
            average_rating,
            total_ratings
          )
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get verified hosts who have posted active tasks
   * @returns {Promise} Array of unique hosts with their tasks and full profile details
   */
  async getVerifiedHostsWithTasks() {
    console.log('[HostService] Fetching host tasks from database...');

    const { data, error } = await supabase
      .from('host_tasks')
      .select(`
        id,
        host_id,
        title,
        description,
        services_needed,
        hours_per_week,
        frequency,
        schedule,
        duration,
        compensation,
        requirements,
        additional_notes,
        status,
        created_at,
        host:user_profiles!host_id (
          id,
          full_name,
          email,
          phone_number,
          is_verified,
          is_active,
          host_profile:host_profiles!user_id (
            address,
            city,
            postcode,
            property_description,
            number_of_rooms,
            amenities,
            accessibility_features,
            preferred_gender,
            preferred_age_range,
            support_needs,
            additional_info,
            profile_picture_url,
            average_rating,
            total_ratings
          )
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[HostService] Error fetching tasks:', error);
      throw error;
    }

    console.log('[HostService] Raw tasks fetched:', data?.length || 0);
    console.log('[HostService] Sample task data:', data?.[0]);

    // Filter to only include verified and active hosts
    const filteredTasks = data.filter(task => {
      const isVerified = task.host?.is_verified === true;
      const isActive = task.host?.is_active === true;
      const hasProfile = !!task.host?.host_profile;

      if (!isVerified || !isActive || !hasProfile) {
        console.log(`[HostService] Filtered out task ${task.id}:`, {
          isVerified,
          isActive,
          hasProfile,
          hostName: task.host?.full_name
        });
      }

      return isVerified && isActive && hasProfile;
    });

    console.log('[HostService] Tasks after filtering:', filteredTasks.length);

    // Group tasks by host and create comprehensive host objects
    const verifiedHosts = filteredTasks.reduce((acc, task) => {
      const hostId = task.host_id;
      const hostProfile = task.host.host_profile;

      // If we haven't seen this host yet, add them with full details
      if (!acc[hostId]) {
        acc[hostId] = {
          // Host Basic Info
          id: hostId,
          name: task.host.full_name,
          email: task.host.email,
          phone: task.host.phone_number,
          verified: true,

          // Host Profile Details
          location: `${hostProfile.city}${hostProfile.postcode ? ', ' + hostProfile.postcode : ''}`,
          city: hostProfile.city,
          postcode: hostProfile.postcode,
          address: hostProfile.address,
          propertyDescription: hostProfile.property_description || 'Cozy accommodation available',
          numberOfRooms: hostProfile.number_of_rooms,
          amenities: hostProfile.amenities || [],
          accessibilityFeatures: hostProfile.accessibility_features || [],
          preferredGender: hostProfile.preferred_gender,
          preferredAgeRange: hostProfile.preferred_age_range,
          supportNeeds: hostProfile.support_needs,
          additionalInfo: hostProfile.additional_info,
          profilePictureUrl: hostProfile.profile_picture_url,

          // Rating Info
          rating: parseFloat(hostProfile.average_rating) || 0,
          reviewCount: hostProfile.total_ratings || 0,

          // Tasks Array - store all tasks for this host
          tasks: [{
            id: task.id,
            title: task.title,
            description: task.description,
            servicesNeeded: task.services_needed,
            hoursPerWeek: task.hours_per_week,
            frequency: task.frequency,
            schedule: task.schedule,
            duration: task.duration,
            compensation: task.compensation,
            requirements: task.requirements,
            additionalNotes: task.additional_notes,
            createdAt: task.created_at
          }],

          // Aggregated services across all tasks
          allServicesNeeded: [...task.services_needed],

          // For backward compatibility
          servicesNeeded: [...task.services_needed],
          accommodation: hostProfile.property_description || 'Accommodation available',
          about: hostProfile.property_description || '',
          imageUrl: hostProfile.profile_picture_url || null,
        };
      } else {
        // Add this task to existing host's tasks array
        acc[hostId].tasks.push({
          id: task.id,
          title: task.title,
          description: task.description,
          servicesNeeded: task.services_needed,
          hoursPerWeek: task.hours_per_week,
          frequency: task.frequency,
          schedule: task.schedule,
          duration: task.duration,
          compensation: task.compensation,
          requirements: task.requirements,
          additionalNotes: task.additional_notes,
          createdAt: task.created_at
        });

        // Merge services from all tasks
        const existingServices = new Set(acc[hostId].allServicesNeeded);
        task.services_needed.forEach(service => existingServices.add(service));
        acc[hostId].allServicesNeeded = Array.from(existingServices);
        acc[hostId].servicesNeeded = Array.from(existingServices); // For backward compatibility
      }

      return acc;
    }, {});

    // Convert object to array and return
    const result = Object.values(verifiedHosts);
    console.log('[HostService] Final hosts to return:', result.length);
    console.log('[HostService] Sample host:', result[0]);
    return result;
  },

  /**
   * Get a single host's complete profile with all their tasks
   * @param {string} hostId - Host user ID
   * @returns {Promise} Host object with full details and tasks
   */
  async getHostById(hostId) {
    console.log('[HostService] Fetching host details for ID:', hostId);

    const { data, error } = await supabase
      .from('host_tasks')
      .select(`
        id,
        host_id,
        title,
        description,
        services_needed,
        hours_per_week,
        frequency,
        schedule,
        duration,
        compensation,
        requirements,
        additional_notes,
        status,
        created_at,
        host:user_profiles!host_id (
          id,
          full_name,
          email,
          phone_number,
          is_verified,
          is_active,
          created_at,
          host_profile:host_profiles!user_id (
            address,
            city,
            postcode,
            property_description,
            number_of_rooms,
            amenities,
            accessibility_features,
            preferred_gender,
            preferred_age_range,
            support_needs,
            additional_info,
            profile_picture_url,
            average_rating,
            total_ratings
          )
        )
      `)
      .eq('host_id', hostId)
      .eq('status', 'active');

    if (error) {
      console.error('[HostService] Error fetching host:', error);
      throw error;
    }

    console.log('[HostService] Raw host tasks:', data?.length || 0);

    if (!data || data.length === 0) {
      throw new Error('Host not found or has no active tasks');
    }

    // Take the first task to get host details
    const firstTask = data[0];
    const hostProfile = firstTask.host.host_profile;

    if (!hostProfile) {
      throw new Error('Host profile not found');
    }

    // Build comprehensive host object with all tasks
    const host = {
      // Basic Info
      id: hostId,
      name: firstTask.host.full_name,
      email: firstTask.host.email,
      phone: firstTask.host.phone_number,
      verified: firstTask.host.is_verified,
      memberSince: new Date(firstTask.host.created_at).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric'
      }),

      // Profile Details
      location: `${hostProfile.city}${hostProfile.postcode ? ', ' + hostProfile.postcode : ''}`,
      city: hostProfile.city,
      postcode: hostProfile.postcode,
      address: hostProfile.address,
      propertyDescription: hostProfile.property_description || 'No description provided',
      numberOfRooms: hostProfile.number_of_rooms,
      amenities: hostProfile.amenities || [],
      accessibilityFeatures: hostProfile.accessibility_features || [],
      preferredGender: hostProfile.preferred_gender,
      preferredAgeRange: hostProfile.preferred_age_range,
      supportNeeds: hostProfile.support_needs,
      additionalInfo: hostProfile.additional_info,
      profilePictureUrl: hostProfile.profile_picture_url,

      // Rating Info
      rating: parseFloat(hostProfile.average_rating) || 0,
      reviewCount: hostProfile.total_ratings || 0,

      // Tasks Array - all active tasks for this host
      tasks: data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        servicesNeeded: task.services_needed,
        hoursPerWeek: task.hours_per_week,
        frequency: task.frequency,
        schedule: task.schedule,
        duration: task.duration,
        compensation: task.compensation,
        requirements: task.requirements,
        additionalNotes: task.additional_notes,
        createdAt: task.created_at
      })),

      // Aggregated services across all tasks
      allServicesNeeded: [...new Set(data.flatMap(task => task.services_needed))],

      // Legacy fields for backward compatibility
      servicesNeeded: [...new Set(data.flatMap(task => task.services_needed))],
      imageUrl: hostProfile.profile_picture_url || null,
      about: hostProfile.property_description || '',
    };

    console.log('[HostService] Host details built:', host);
    return host;
  },

  /**
   * Get tasks by host ID
   * @param {string} hostId - Host user ID
   * @returns {Promise} Array of tasks
   */
  async getTasksByHostId(hostId) {
    const { data, error } = await supabase
      .from('host_tasks')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get a single task by ID
   * @param {string} taskId - Task ID
   * @returns {Promise} Task data
   */
  async getTaskById(taskId) {
    const { data, error } = await supabase
      .from('host_tasks')
      .select(`
        *,
        host:user_profiles!host_id (
          id,
          full_name,
          email,
          phone_number,
          host_profile:host_profiles!user_id (
            address,
            city,
            postcode,
            property_description,
            amenities,
            accessibility_features,
            profile_picture_url,
            average_rating,
            total_ratings
          )
        )
      `)
      .eq('id', taskId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise} Updated task data
   */
  async updateTask(taskId, updates) {
    const { data, error } = await supabase
      .from('host_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Promise} Success status
   */
  async deleteTask(taskId) {
    const { error } = await supabase
      .from('host_tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Update task status
   * @param {string} taskId - Task ID
   * @param {string} status - New status (active, filled, closed)
   * @returns {Promise} Updated task data
   */
  async updateTaskStatus(taskId, status) {
    return this.updateTask(taskId, { status });
  },

  /**
   * Increment applicant count for a task
   * @param {string} taskId - Task ID
   * @returns {Promise} Updated task data
   */
  async incrementApplicantCount(taskId) {
    const { data, error } = await supabase.rpc('increment_applicant_count', {
      task_id: taskId,
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const task = await this.getTaskById(taskId);
      return this.updateTask(taskId, {
        applicant_count: (task.applicant_count || 0) + 1,
      });
    }

    return data;
  },
};

export default hostService;
