import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    fullName: 'Sarah K.',
    email: 'sarah.k@ucl.ac.uk',
    phone: '+44 7XXX XXXXXX',
    university: 'University College London',
    userType: 'student',
    memberSince: '2025-01-15',
    isVerified: true,
    rating: 4.8,
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    seniorMode: false,
    voiceGuidance: false,
    helpOverlay: false,
    colorBlindMode: 'none', // none, protanopia, deuteranopia, tritanopia
  });

  const updateUser = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };

  const updateAccessibilitySettings = (updates) => {
    setAccessibilitySettings((prevSettings) => ({
      ...prevSettings,
      ...updates,
    }));
  };

  const getFirstName = () => {
    return user.fullName.split(' ')[0];
  };

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      getFirstName,
      accessibilitySettings,
      updateAccessibilitySettings,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
