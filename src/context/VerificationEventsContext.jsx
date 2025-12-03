import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import supabase from '../utils/supabase';

const VerificationEventsContext = createContext();

export const useVerificationEvents = () => {
  const context = useContext(VerificationEventsContext);
  if (!context) {
    throw new Error('useVerificationEvents must be used within VerificationEventsProvider');
  }
  return context;
};

export const VerificationEventsProvider = ({ children }) => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [newSignupCount, setNewSignupCount] = useState(0);

  // Call this when a user is verified or rejected
  const notifyVerificationChange = useCallback(() => {
    setLastUpdate(Date.now());
    // Also emit a custom event for non-React code if needed
    window.dispatchEvent(new CustomEvent('verificationChanged'));
  }, []);

  // Call this when a new user signs up
  const notifyNewSignup = useCallback(() => {
    setLastUpdate(Date.now());
    setNewSignupCount(prev => prev + 1);
    window.dispatchEvent(new CustomEvent('newUserSignup'));
  }, []);

  // Set up real-time subscription for new user signups
  useEffect(() => {
    // Subscribe to INSERT events on user_profiles table
    const subscription = supabase
      .channel('user_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_profiles',
        },
        (payload) => {
          console.log('New user signup detected:', payload.new);
          notifyNewSignup();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
        },
        (payload) => {
          // Trigger update when verification status changes
          console.log('User profile updated:', payload.new);
          notifyVerificationChange();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [notifyNewSignup, notifyVerificationChange]);

  const value = {
    lastUpdate,
    newSignupCount,
    notifyVerificationChange,
    notifyNewSignup,
  };

  return (
    <VerificationEventsContext.Provider value={value}>
      {children}
    </VerificationEventsContext.Provider>
  );
};
