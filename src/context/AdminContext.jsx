import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../utils/supabase';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // Admin user state with role-based permissions
  const [adminUser, setAdminUser] = useState({
    id: null,
    fullName: 'Admin User',
    email: 'admin@hostfamilystay.com',
    role: 'super_admin', // super_admin, admin, moderator, support
    permissions: [
      'verify_documents',
      'approve_connections',
      'manage_users',
      'create_profiles',
      'view_reports',
      'moderate_content',
      'access_analytics',
      'handle_disputes',
      'manage_admins',
    ],
    isAuthenticated: false,
  });

  // Check for existing Supabase session on mount
  useEffect(() => {
    checkAdminSession();
  }, []);

  // Role-based permission definitions
  const ROLE_PERMISSIONS = {
    super_admin: [
      'verify_documents',
      'approve_connections',
      'manage_users',
      'create_profiles',
      'view_reports',
      'moderate_content',
      'access_analytics',
      'handle_disputes',
      'manage_admins',
      'delete_users',
      'export_data',
    ],
    admin: [
      'verify_documents',
      'approve_connections',
      'manage_users',
      'create_profiles',
      'view_reports',
      'moderate_content',
      'access_analytics',
      'handle_disputes',
    ],
    moderator: [
      'verify_documents',
      'approve_connections',
      'view_reports',
      'moderate_content',
    ],
    support: [
      'view_reports',
      'approve_connections',
      'create_profiles',
    ],
  };

  // Check if admin has specific permission
  const hasPermission = (permission) => {
    return adminUser.permissions.includes(permission);
  };

  // Check if admin has specific role
  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(adminUser.role);
    }
    return adminUser.role === role;
  };

  // Check if there's an existing admin session
  const checkAdminSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error checking session:', error);
        return;
      }

      if (session?.user) {
        // Fetch user profile to check if they're an admin
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching admin profile:', profileError);
          return;
        }

        // Only set admin user if they have admin role
        if (profile && profile.role === 'admin') {
          const permissions = ROLE_PERMISSIONS[profile.role] || ROLE_PERMISSIONS.admin;
          setAdminUser({
            id: profile.id,
            fullName: profile.full_name,
            email: profile.email,
            role: profile.role,
            permissions: permissions,
            isAuthenticated: true,
          });
        }
      }
    } catch (error) {
      console.error('Error in checkAdminSession:', error);
    }
  };

  // Login admin with Supabase authentication
  const loginAdmin = async (email, password, role = 'admin') => {
    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Authentication error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user returned from authentication');
      }

      // Fetch user profile to verify admin role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Check if user has admin role
      if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This account does not have admin privileges.');
      }

      // Set admin user with proper permissions
      const permissions = ROLE_PERMISSIONS[profile.role] || ROLE_PERMISSIONS.admin;
      setAdminUser({
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        role: profile.role,
        permissions: permissions,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout admin
  const logoutAdmin = async () => {
    try {
      await supabase.auth.signOut();
      setAdminUser({
        id: null,
        fullName: 'Admin User',
        email: '',
        role: 'admin',
        permissions: [],
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update admin profile
  const updateAdminProfile = (updates) => {
    setAdminUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        hasPermission,
        hasRole,
        loginAdmin,
        logoutAdmin,
        updateAdminProfile,
        ROLE_PERMISSIONS,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
