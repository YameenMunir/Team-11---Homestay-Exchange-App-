import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
