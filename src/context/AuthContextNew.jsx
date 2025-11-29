import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      // 1. Create auth user with metadata and email redirect
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role, // Store role in metadata
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // 2. Wait for the trigger to create the basic profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Update the auto-created profile with complete data
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          role: userData.role,
          full_name: userData.full_name,
          phone_number: userData.phone_number,
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        // Don't throw - profile was created, just not fully updated
      }

      // 4. Create role-specific profile
      if (userData.role === 'host') {
        const { error: hostError } = await supabase
          .from('host_profiles')
          .insert([
            {
              user_id: authData.user.id,
              address: userData.address,
              postcode: userData.postcode,
              city: userData.city,
              date_of_birth: userData.date_of_birth,
            },
          ]);
        if (hostError) {
          console.error('Host profile error:', hostError);
        }
      } else if (userData.role === 'guest') {
        const { error: guestError} = await supabase
          .from('guest_profiles')
          .insert([
            {
              user_id: authData.user.id,
              date_of_birth: userData.date_of_birth,
              university: userData.university,
              course: userData.course,
              year_of_study: userData.year_of_study,
            },
          ]);
        if (guestError) {
          console.error('Guest profile error:', guestError);
        }
      }

      return {
        data: authData,
        error: null,
        needsEmailConfirmation: !authData.session // If no session, email confirmation required
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    return { error };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => user && fetchProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
