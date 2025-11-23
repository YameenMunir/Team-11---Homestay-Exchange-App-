import { createContext, useContext, useState } from 'react';

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
    id: 1,
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

  // Login admin
  const loginAdmin = (email, password, role = 'admin') => {
    // TODO: Replace with actual API call
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin;
    setAdminUser({
      id: 1,
      fullName: 'Admin User',
      email: email,
      role: role,
      permissions: permissions,
      isAuthenticated: true,
    });
    return true;
  };

  // Logout admin
  const logoutAdmin = () => {
    setAdminUser({
      ...adminUser,
      isAuthenticated: false,
    });
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
