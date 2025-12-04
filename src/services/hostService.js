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
          host_profile:host_profiles (
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
   * @returns {Promise} Array of unique hosts with their tasks
   */
  async getVerifiedHostsWithTasks() {
    const { data, error } = await supabase
      .from('host_tasks')
      .select(`
        host_id,
        services_needed,
        host:user_profiles!host_id (
          id,
          full_name,
          email,
          is_verified,
          is_active,
          host_profile:host_profiles (
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
      .eq('status', 'active');

    if (error) throw error;

    // Filter to only include verified and active hosts
    const verifiedHosts = data
      .filter(task =>
        task.host?.is_verified === true &&
        task.host?.is_active === true &&
        task.host.host_profile
      )
      .reduce((acc, task) => {
        const hostId = task.host_id;

        // If we haven't seen this host yet, add them
        if (!acc[hostId]) {
          acc[hostId] = {
            id: hostId,
            name: task.host.full_name,
            email: task.host.email,
            location: `${task.host.host_profile.city}, ${task.host.host_profile.postcode}`,
            address: task.host.host_profile.address,
            city: task.host.host_profile.city,
            postcode: task.host.host_profile.postcode,
            servicesNeeded: [...task.services_needed],
            accommodation: task.host.host_profile.property_description || 'Accommodation available',
            about: task.host.host_profile.property_description || '',
            amenities: task.host.host_profile.amenities || [],
            accessibilityFeatures: task.host.host_profile.accessibility_features || [],
            verified: true,
            imageUrl: task.host.host_profile.profile_picture_url || null,
            rating: parseFloat(task.host.host_profile.average_rating) || 0,
            reviewCount: task.host.host_profile.total_ratings || 0,
          };
        } else {
          // If we've seen this host, merge their services
          const existingServices = new Set(acc[hostId].servicesNeeded);
          task.services_needed.forEach(service => existingServices.add(service));
          acc[hostId].servicesNeeded = Array.from(existingServices);
        }

        return acc;
      }, {});

    // Convert object to array
    return Object.values(verifiedHosts);
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
          host_profile:host_profiles (
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
