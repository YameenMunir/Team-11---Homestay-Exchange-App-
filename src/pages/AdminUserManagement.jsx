import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Home,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  FileText,
  ExternalLink,
  Loader2,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useVerificationEvents } from '../context/VerificationEventsContext';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAdmin();
  const { notifyVerificationChange, lastUpdate } = useVerificationEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, host, guest
  const [filterStatus, setFilterStatus] = useState('all'); // all, verified, pending
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    setIsInitialMount(false);
  }, []);

  // Re-fetch users when verification changes or new signups occur
  useEffect(() => {
    if (lastUpdate && !isInitialMount) {
      fetchUsers();
      toast.success('User list updated');
    }
  }, [lastUpdate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };


  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.userType === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleVerifyUser = async (userId) => {
    try {
      await adminService.verifyUser(userId);
      toast.success('User verified successfully!');
      // Notify other components that verification status changed
      notifyVerificationChange();
      // Refresh users list
      await fetchUsers();
      setShowUserModal(false);
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
  };

  const handleRejectUser = (user) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await adminService.rejectUser(selectedUser.id, rejectReason);
      toast.success('User verification rejected');
      // Notify other components that verification status changed
      notifyVerificationChange();
      setRejectReason('');
      setShowRejectModal(false);
      setShowUserModal(false);
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
    }
  };

  const handleReactivateUser = async (userId) => {
    if (window.confirm('Reactivate this user? They will be moved back to pending verification status.')) {
      try {
        await adminService.reactivateUser(userId);
        toast.success('User reactivated and set to pending status');
        // Notify other components that verification status changed
        notifyVerificationChange();
        // Refresh users list
        await fetchUsers();
      } catch (error) {
        console.error('Error reactivating user:', error);
        toast.error('Failed to reactivate user');
      }
    }
  };

  const handleUnsuspendUser = async (userId) => {
    if (window.confirm('Remove suspension from this user? They will be reactivated.')) {
      try {
        await adminService.unsuspendUser(userId);
        toast.success('User suspension removed successfully');
        // Notify other components that verification status changed
        notifyVerificationChange();
        // Refresh users list
        await fetchUsers();
      } catch (error) {
        console.error('Error unsuspending user:', error);
        toast.error('Failed to unsuspend user');
      }
    }
  };

  const handleSuspendUser = async (userId) => {
    const reason = prompt('Enter suspension reason:');
    if (reason) {
      try {
        await adminService.suspendUser(userId, reason);
        toast.success('User suspended successfully');
        // Notify other components that verification status changed
        notifyVerificationChange();
        // Refresh users list
        await fetchUsers();
      } catch (error) {
        console.error('Error suspending user:', error);
        toast.error('Failed to suspend user');
      }
    }
  };

  const handleBanUser = async (userId) => {
    const reason = prompt('Enter ban reason:');
    if (reason) {
      if (window.confirm('Ban this user? They will not be able to access the platform but can be unbanned later.')) {
        try {
          await adminService.banUser(userId, reason);
          toast.success('User banned successfully');
          // Notify other components that verification status changed
          notifyVerificationChange();
          // Refresh users list
          await fetchUsers();
        } catch (error) {
          console.error('Error banning user:', error);
          toast.error('Failed to ban user');
        }
      }
    }
  };

  const handleUnbanUser = async (userId) => {
    if (window.confirm('Remove ban from this user? They will be restored to their previous status.')) {
      try {
        await adminService.unbanUser(userId);
        toast.success('User unbanned successfully');
        // Notify other components that verification status changed
        notifyVerificationChange();
        // Refresh users list
        await fetchUsers();
      } catch (error) {
        console.error('Error unbanning user:', error);
        toast.error('Failed to unban user');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to PERMANENTLY delete this user? This action CANNOT be undone and will remove all their data.')) {
      try {
        await adminService.deleteUser(userId);
        toast.success('User permanently deleted');
        // Notify other components that verification status changed
        notifyVerificationChange();
        // Refresh users list
        await fetchUsers();
        setShowUserModal(false);
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleExportUsers = async () => {
    try {
      await adminService.exportUsersToCSV();
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-orange-100 text-orange-800',
      banned: 'bg-gray-800 text-white',
    };
    const icons = {
      verified: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      suspended: <UserX className="w-3 h-3" />,
      banned: <Shield className="w-3 h-3" />,
    };
    return (
      <span className={`badge ${styles[status]} flex items-center space-x-1`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn-secondary flex items-center space-x-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
                User Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage all hosts and students on the platform
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge bg-green-100 text-green-800 flex items-center space-x-1">
                <Activity className="w-3 h-3" />
                <span>Auto-refreshing</span>
              </span>
              <button
                onClick={fetchUsers}
                className="btn-outline flex items-center space-x-2"
                title="Manually refresh user list"
              >
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <span className="text-3xl font-bold text-gray-900">{users.length}</span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Verified</p>
            <span className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.status === 'verified').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <span className="text-3xl font-bold text-yellow-600">
              {users.filter((u) => u.status === 'pending').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Suspended</p>
            <span className="text-3xl font-bold text-orange-600">
              {users.filter((u) => u.status === 'suspended').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Banned</p>
            <span className="text-3xl font-bold text-gray-800">
              {users.filter((u) => u.status === 'banned').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <span className="text-3xl font-bold text-red-600">
              {users.filter((u) => u.status === 'rejected').length}
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="input-field pl-10"
                  aria-label="Search users"
                />
              </div>
            </div>

            {/* User Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
                aria-label="Filter by user type"
              >
                <option value="all">All Types</option>
                <option value="host">Hosts Only</option>
                <option value="guest">Students Only</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          {hasPermission('export_data') && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleExportUsers}
                className="btn-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Since
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.userType === 'host' ? 'bg-teal-100' : 'bg-blue-100'
                        }`}>
                          {user.userType === 'host' ? (
                            <Home className="w-5 h-5 text-teal-600" />
                          ) : (
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        user.userType === 'host' ? 'badge-purple' : 'badge-blue'
                      }`}>
                        {user.userType === 'host' ? 'Host' : 'Student'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center space-x-2 mb-1">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      {user.address && (
                        <div className="flex items-center space-x-2 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{user.postcode}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.rating ? (
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold">{user.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No ratings</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.memberSince).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-teal-600 hover:text-teal-900 transition-colors"
                          title="View Details"
                          aria-label="View user details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {/* Actions for Pending Users */}
                        {hasPermission('verify_documents') && user.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerifyUser(user.id)}
                              className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                              title="Approve Verification"
                              aria-label="Approve user verification"
                            >
                              <UserCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectUser(user)}
                              className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                              title="Reject Verification"
                              aria-label="Reject user verification"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Actions for Verified Users */}
                        {hasPermission('manage_users') && user.status === 'verified' && (
                          <>
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              className="p-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition-colors"
                              title="Suspend User"
                              aria-label="Suspend user account"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Ban User"
                              aria-label="Ban user account"
                            >
                              <Shield className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Actions for Suspended Users */}
                        {hasPermission('manage_users') && user.status === 'suspended' && (
                          <>
                            <button
                              onClick={() => handleUnsuspendUser(user.id)}
                              className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                              title="Remove Suspension"
                              aria-label="Remove user suspension"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Ban User"
                              aria-label="Ban user account"
                            >
                              <Shield className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Actions for Banned Users */}
                        {hasPermission('manage_users') && user.status === 'banned' && (
                          <>
                            <button
                              onClick={() => handleUnbanUser(user.id)}
                              className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                              title="Unban User"
                              aria-label="Unban user account"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                              title="Delete Permanently"
                              aria-label="Permanently delete user"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Actions for Rejected Users */}
                        {hasPermission('manage_users') && user.status === 'rejected' && (
                          <button
                            onClick={() => handleReactivateUser(user.id)}
                            className="p-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                            title="Reactivate User"
                            aria-label="Reactivate user"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}

                        {/* Delete button for non-verified, non-suspended users */}
                        {hasPermission('delete_users') && user.status !== 'verified' && user.status !== 'suspended' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete User"
                            aria-label="Delete user"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Results */}
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedUser.fullName}
                  </h3>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedUser.phone}</span>
                    </div>
                    {selectedUser.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedUser.address}, {selectedUser.postcode}</span>
                      </div>
                    )}
                    {selectedUser.university && (
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{selectedUser.university} - {selectedUser.course} (Year {selectedUser.yearOfStudy})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rejection Reason (if rejected) */}
                {selectedUser.status === 'rejected' && selectedUser.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Rejection Reason
                    </h4>
                    <p className="text-sm text-red-800">{selectedUser.rejectionReason}</p>
                  </div>
                )}

                {/* Suspension Reason (if suspended) */}
                {selectedUser.status === 'suspended' && selectedUser.suspensionReason && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
                      <UserX className="w-4 h-4" />
                      Suspension Reason
                    </h4>
                    <p className="text-sm text-orange-800">{selectedUser.suspensionReason}</p>
                    {selectedUser.suspendedAt && (
                      <p className="text-xs text-orange-600 mt-2">
                        Suspended on: {new Date(selectedUser.suspendedAt).toLocaleString('en-GB')}
                      </p>
                    )}
                  </div>
                )}

                {/* Ban Reason (if banned) */}
                {selectedUser.status === 'banned' && selectedUser.banReason && (
                  <div className="bg-gray-800 border border-gray-900 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Ban Reason
                    </h4>
                    <p className="text-sm text-gray-100">{selectedUser.banReason}</p>
                    {selectedUser.bannedAt && (
                      <p className="text-xs text-gray-300 mt-2">
                        Banned on: {new Date(selectedUser.bannedAt).toLocaleString('en-GB')}
                      </p>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(selectedUser.memberSince).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Arrangements</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedUser.totalArrangements}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Rating</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedUser.rating ? `${selectedUser.rating} ★` : 'No ratings'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Documents</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedUser.documentsSubmitted ? 'Submitted' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submitted Documents */}
                {selectedUser.documentsSubmitted && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Submitted Documents</h4>
                    <div className="space-y-2">
                      {selectedUser.idDocumentUrl && (
                        <a
                          href={selectedUser.idDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">ID Document</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {selectedUser.proofOfAddressUrl && (
                        <a
                          href={selectedUser.proofOfAddressUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Proof of Address</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {selectedUser.studentIdUrl && (
                        <a
                          href={selectedUser.studentIdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Student ID</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {selectedUser.dbsCheckUrl && (
                        <a
                          href={selectedUser.dbsCheckUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">DBS Check</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      )}
                      {!selectedUser.idDocumentUrl && !selectedUser.proofOfAddressUrl &&
                       !selectedUser.studentIdUrl && !selectedUser.dbsCheckUrl && (
                        <p className="text-sm text-gray-500 italic">No documents uploaded yet</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Close
                  </button>
                  {hasPermission('verify_documents') && selectedUser.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleRejectUser(selectedUser)}
                        className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerifyUser(selectedUser.id)}
                        className="btn-primary flex-1"
                      >
                        Verify User
                      </button>
                    </>
                  )}
                  {hasPermission('manage_users') && selectedUser.status === 'suspended' && (
                    <button
                      onClick={() => handleUnsuspendUser(selectedUser.id)}
                      className="btn-primary flex-1"
                    >
                      Remove Suspension
                    </button>
                  )}
                  {hasPermission('manage_users') && selectedUser.status === 'banned' && (
                    <>
                      <button
                        onClick={() => handleUnbanUser(selectedUser.id)}
                        className="btn-primary flex-1"
                      >
                        Unban User
                      </button>
                      <button
                        onClick={() => handleDeleteUser(selectedUser.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Delete Permanently
                      </button>
                    </>
                  )}
                  {hasPermission('manage_users') && selectedUser.status === 'rejected' && (
                    <button
                      onClick={() => handleReactivateUser(selectedUser.id)}
                      className="btn-primary flex-1"
                    >
                      Reactivate User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Reject Verification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Rejecting verification for {selectedUser.fullName}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejecting this user's verification..."
                  className="input-field min-h-[120px]"
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This reason will be sent to the user via email
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reject Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
