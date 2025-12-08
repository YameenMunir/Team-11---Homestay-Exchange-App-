import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    seniorMode: false,
    voiceGuidance: false,
    helpOverlay: false,
    colorBlindMode: 'none', // none, protanopia, deuteranopia, tritanopia
  });

  // Fetch user profile data from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get user profile from user_profiles table (including accessibility settings)
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        // Load accessibility settings from database if they exist
        if (userProfile) {
          setAccessibilitySettings({
            seniorMode: userProfile.senior_mode || false,
            voiceGuidance: userProfile.voice_guidance || false,
            helpOverlay: userProfile.help_overlay || false,
            colorBlindMode: userProfile.color_blind_mode || 'none',
          });
        }

        // Determine user type and fetch role-specific profile
        const userRole = userProfile.role;
        let roleProfile = null;

        if (userRole === 'host') {
          const { data, error } = await supabase
            .from('host_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (!error) roleProfile = data;
        } else if (userRole === 'guest') {
          const { data, error } = await supabase
            .from('guest_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (!error) roleProfile = data;
        }

        // Determine verification status
        const isVerified = userProfile.is_verified || false;
        const isActive = userProfile.is_active !== false; // Default to true if not set

        // Determine status: pending, verified, or rejected
        let verificationStatus = 'pending';
        if (isVerified && isActive) {
          verificationStatus = 'verified';
        } else if (!isVerified && !isActive) {
          verificationStatus = 'rejected';
        } else if (!isVerified && isActive) {
          verificationStatus = 'pending';
        }

        // Combine all data into user object
        setUser({
          id: authUser.id,
          fullName: userProfile.full_name || authUser.user_metadata?.full_name || 'User',
          email: userProfile.email || authUser.email,
          phone: userProfile.phone_number || '',
          university: roleProfile?.university || '',
          userType: userRole,
          memberSince: new Date(userProfile.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          isVerified,
          isActive,
          verificationStatus,
          rating: roleProfile?.average_rating || 0,
          // Include additional profile data
          ...roleProfile,
        });

      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Set basic user data from auth if profile fetch fails
        setUser({
          id: authUser.id,
          fullName: authUser.user_metadata?.full_name || 'User',
          email: authUser.email,
          phone: '',
          university: '',
          userType: authUser.user_metadata?.role || 'guest',
          memberSince: new Date(authUser.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          isVerified: false,
          isActive: true,
          verificationStatus: 'pending',
          rating: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [authUser, authLoading]);

  // Listen for verification status changes and refresh user data
  useEffect(() => {
    const handleVerificationChange = async () => {
      // Refresh user data when verification status changes
      if (!authUser) return;

      try {
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        // Load accessibility settings from database
        if (userProfile) {
          setAccessibilitySettings({
            seniorMode: userProfile.senior_mode || false,
            voiceGuidance: userProfile.voice_guidance || false,
            helpOverlay: userProfile.help_overlay || false,
            colorBlindMode: userProfile.color_blind_mode || 'none',
          });
        }

        const userRole = userProfile.role;
        let roleProfile = null;

        if (userRole === 'host') {
          const { data, error } = await supabase
            .from('host_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (!error) roleProfile = data;
        } else if (userRole === 'guest') {
          const { data, error } = await supabase
            .from('guest_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (!error) roleProfile = data;
        }

        // Determine verification status
        const isVerified = userProfile.is_verified || false;
        const isActive = userProfile.is_active !== false; // Default to true if not set

        // Determine status: pending, verified, or rejected
        let verificationStatus = 'pending';
        if (isVerified && isActive) {
          verificationStatus = 'verified';
        } else if (!isVerified && !isActive) {
          verificationStatus = 'rejected';
        } else if (!isVerified && isActive) {
          verificationStatus = 'pending';
        }

        setUser({
          id: authUser.id,
          fullName: userProfile.full_name || authUser.user_metadata?.full_name || 'User',
          email: userProfile.email || authUser.email,
          phone: userProfile.phone_number || '',
          university: roleProfile?.university || '',
          userType: userRole,
          memberSince: new Date(userProfile.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          isVerified,
          isActive,
          verificationStatus,
          rating: roleProfile?.average_rating || 0,
          ...roleProfile,
        });
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    // Listen for custom verification changed event
    window.addEventListener('verificationChanged', handleVerificationChange);

    return () => {
      window.removeEventListener('verificationChanged', handleVerificationChange);
    };
  }, [authUser]);

  const updateUser = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };

  const updateAccessibilitySettings = async (updates) => {
    // Update local state immediately for instant UI feedback
    setAccessibilitySettings((prevSettings) => ({
      ...prevSettings,
      ...updates,
    }));

    // Save to database if user is authenticated
    if (authUser?.id) {
      try {
        // Map React state keys to database column names
        const dbUpdates = {};
        if ('seniorMode' in updates) dbUpdates.senior_mode = updates.seniorMode;
        if ('voiceGuidance' in updates) dbUpdates.voice_guidance = updates.voiceGuidance;
        if ('helpOverlay' in updates) dbUpdates.help_overlay = updates.helpOverlay;
        if ('colorBlindMode' in updates) dbUpdates.color_blind_mode = updates.colorBlindMode;

        const { error } = await supabase
          .from('user_profiles')
          .update(dbUpdates)
          .eq('id', authUser.id);

        if (error) {
          console.error('Error saving accessibility settings:', error);
        } else {
          console.log('✅ Accessibility settings saved to database');
        }
      } catch (error) {
        console.error('Error updating accessibility settings:', error);
      }
    }
  };

  const getFirstName = () => {
    if (!user || !user.fullName) return 'User';
    return user.fullName.split(' ')[0];
  };

  // Refresh user data from database
  const refreshUserData = async () => {
    if (!authUser) return;

    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      // Load accessibility settings from database
      if (userProfile) {
        setAccessibilitySettings({
          seniorMode: userProfile.senior_mode || false,
          voiceGuidance: userProfile.voice_guidance || false,
          helpOverlay: userProfile.help_overlay || false,
          colorBlindMode: userProfile.color_blind_mode || 'none',
        });
      }

      const userRole = userProfile.role;
      let roleProfile = null;

      if (userRole === 'host') {
        const { data, error } = await supabase
          .from('host_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (!error) roleProfile = data;
      } else if (userRole === 'guest') {
        const { data, error } = await supabase
          .from('guest_profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (!error) roleProfile = data;
      }

      setUser({
        id: authUser.id,
        fullName: userProfile.full_name || authUser.user_metadata?.full_name || 'User',
        email: userProfile.email || authUser.email,
        phone: userProfile.phone_number || '',
        university: roleProfile?.university || '',
        userType: userRole,
        memberSince: new Date(userProfile.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        isVerified: userProfile.is_verified || false,
        rating: roleProfile?.average_rating || 0,
        ...roleProfile,
      });
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      updateUser,
      refreshUserData,
      getFirstName,
      accessibilitySettings,
      updateAccessibilitySettings,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
