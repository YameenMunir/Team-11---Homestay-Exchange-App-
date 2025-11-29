import supabase from '../utils/supabase';

/**
 * Authentication service for Supabase
 */
export const authService = {
  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user metadata
   * @returns {Promise} Supabase auth response
   */
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Supabase auth response
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current user
   * @returns {Promise} Supabase auth response
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current session
   * @returns {Promise} Current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get the current user
   * @returns {Promise} Current user
   */
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise} Supabase auth response
   */
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise} Supabase auth response
   */
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Update user metadata
   * @param {Object} metadata - User metadata to update
   * @returns {Promise} Supabase auth response
   */
  async updateUserMetadata(metadata) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) throw error;
    return data;
  },
};
