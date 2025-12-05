import supabase from '../utils/supabase';

/**
 * Service for managing saved/favorite hosts
 */
export const savedHostsService = {
  /**
   * Check if a host is saved by the current user
   * @param {string} hostId - Host user ID
   * @returns {Promise<boolean>} True if host is saved
   */
  async isHostSaved(hostId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .from('saved_hosts')
        .select('id')
        .eq('guest_id', user.id)
        .eq('host_id', hostId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('[SavedHosts] Error checking saved status:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('[SavedHosts] Error in isHostSaved:', err);
      return false;
    }
  },

  /**
   * Save a host to favorites
   * @param {string} hostId - Host user ID
   * @returns {Promise} Success status
   */
  async saveHost(hostId) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('saved_hosts')
      .insert({
        guest_id: user.id,
        host_id: hostId,
      })
      .select()
      .single();

    if (error) {
      // If it's a duplicate key error, it's already saved
      if (error.code === '23505') {
        console.log('[SavedHosts] Host already saved');
        return { success: true, message: 'Host already in favorites' };
      }
      throw error;
    }

    console.log('[SavedHosts] Host saved successfully:', data);
    return { success: true, data };
  },

  /**
   * Remove a host from favorites
   * @param {string} hostId - Host user ID
   * @returns {Promise} Success status
   */
  async unsaveHost(hostId) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('saved_hosts')
      .delete()
      .eq('guest_id', user.id)
      .eq('host_id', hostId);

    if (error) {
      throw error;
    }

    console.log('[SavedHosts] Host unsaved successfully');
    return { success: true };
  },

  /**
   * Toggle saved status of a host
   * @param {string} hostId - Host user ID
   * @returns {Promise<boolean>} New saved status
   */
  async toggleSavedHost(hostId) {
    try {
      const isSaved = await this.isHostSaved(hostId);

      if (isSaved) {
        await this.unsaveHost(hostId);
        return false;
      } else {
        await this.saveHost(hostId);
        return true;
      }
    } catch (err) {
      console.error('[SavedHosts] Error toggling saved status:', err);
      throw err;
    }
  },

  /**
   * Get all saved hosts for the current user
   * @returns {Promise<Array>} Array of saved host IDs
   */
  async getSavedHostIds() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('saved_hosts')
        .select('host_id')
        .eq('guest_id', user.id);

      if (error) {
        throw error;
      }

      return data.map(item => item.host_id);
    } catch (err) {
      console.error('[SavedHosts] Error getting saved hosts:', err);
      return [];
    }
  },

  /**
   * Get all saved hosts with full profile details
   * @returns {Promise<Array>} Array of host objects
   */
  async getSavedHostsWithProfiles() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('saved_hosts')
        .select(`
          host_id,
          created_at,
          host:user_profiles!host_id (
            id,
            full_name,
            email,
            is_verified,
            host_profile:host_profiles!user_id (
              city,
              postcode,
              property_description,
              number_of_rooms,
              amenities,
              profile_picture_url,
              average_rating,
              total_ratings
            )
          )
        `)
        .eq('guest_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data into a more usable format
      const savedHosts = data
        .filter(item => item.host && item.host.host_profile)
        .map(item => ({
          savedAt: item.created_at,
          id: item.host.id,
          name: item.host.full_name,
          email: item.host.email,
          verified: item.host.is_verified,
          location: `${item.host.host_profile.city}${
            item.host.host_profile.postcode ? ', ' + item.host.host_profile.postcode : ''
          }`,
          city: item.host.host_profile.city,
          postcode: item.host.host_profile.postcode,
          propertyDescription: item.host.host_profile.property_description,
          numberOfRooms: item.host.host_profile.number_of_rooms,
          amenities: item.host.host_profile.amenities || [],
          profilePictureUrl: item.host.host_profile.profile_picture_url,
          rating: parseFloat(item.host.host_profile.average_rating) || 0,
          reviewCount: item.host.host_profile.total_ratings || 0,
          imageUrl: item.host.host_profile.profile_picture_url,
        }));

      console.log('[SavedHosts] Retrieved saved hosts:', savedHosts.length);
      return savedHosts;
    } catch (err) {
      console.error('[SavedHosts] Error getting saved hosts with profiles:', err);
      return [];
    }
  },

  /**
   * Get count of saved hosts for the current user
   * @returns {Promise<number>} Count of saved hosts
   */
  async getSavedHostsCount() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return 0;
      }

      const { count, error } = await supabase
        .from('saved_hosts')
        .select('*', { count: 'exact', head: true })
        .eq('guest_id', user.id);

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (err) {
      console.error('[SavedHosts] Error getting saved hosts count:', err);
      return 0;
    }
  },
};

export default savedHostsService;
