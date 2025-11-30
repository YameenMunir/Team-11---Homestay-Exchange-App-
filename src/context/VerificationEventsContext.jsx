import { createContext, useContext, useState, useCallback } from 'react';

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

  // Call this when a user is verified or rejected
  const notifyVerificationChange = useCallback(() => {
    setLastUpdate(Date.now());
    // Also emit a custom event for non-React code if needed
    window.dispatchEvent(new CustomEvent('verificationChanged'));
  }, []);

  const value = {
    lastUpdate,
    notifyVerificationChange,
  };

  return (
    <VerificationEventsContext.Provider value={value}>
      {children}
    </VerificationEventsContext.Provider>
  );
};
