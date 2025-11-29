import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContextNew';

export const useProfile = () => {
  const { user, profile } = useAuth();
  const [roleProfile, setRoleProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile?.role) {
      fetchRoleProfile();
    }
  }, [profile]);

  const fetchRoleProfile = async () => {
    if (!profile || !user) return;

    try {
      setLoading(true);
      const tableName = profile.role === 'host' ? 'host_profiles' : 'guest_profiles';

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setRoleProfile(data);
    } catch (err) {
      console.error('Error fetching role profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!profile || !user) return { error: new Error('No user found') };

    try {
      const tableName = profile.role === 'host' ? 'host_profiles' : 'guest_profiles';

      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchRoleProfile();
      return { error: null };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { error: err };
    }
  };

  return {
    profile,
    roleProfile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchRoleProfile,
  };
};
