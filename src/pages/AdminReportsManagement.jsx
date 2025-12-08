import { useState } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Clock,
  ShieldAlert,
  TrendingUp,
  Mail,
  Phone,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminReportsManagement = () => {
  const { hasPermission } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all'); // all, urgent, normal
  const [filterStatus, setFilterStatus] = useState('pending'); // all, pending, reviewing, resolved
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock reports data - Replace with API call
  const reports = [
    {
      id: 1,
      category: 'Safety Concern',
      priority: 'urgent',
      subject: 'Unsafe living conditions',
      description: 'The room provided is damp and has mold. I have respiratory issues and this is affecting my health. I have tried to discuss this with the host but they are dismissive.',
      reportedBy: {
        name: 'Emma Wilson',
        email: 'emma.w@ucl.ac.uk',
        phone: '07XXX 789 012',
        userType: 'student',
      },
      reportedAbout: {
        name: 'Robert Anderson',
        email: 'robert.a@email.com',
        userType: 'host',
      },
      status: 'pending',
      submittedDate: '2025-01-22',
      assignedTo: null,
    },
    {
      id: 2,
      category: 'Inappropriate Behavior',
      priority: 'urgent',
      subject: 'Harassment and inappropriate comments',
      description: 'The host has been making uncomfortable personal comments and asking inappropriate questions about my personal life. I feel unsafe.',
      reportedBy: {
        name: 'Sarah K.',
        email: 'sarah.k@ucl.ac.uk',
        phone: '07XXX 999 888',
        userType: 'student',
      },
      reportedAbout: {
        name: 'John Smith',
        email: 'john.s@gmail.com',
        userType: 'host',
      },
      status: 'reviewing',
      submittedDate: '2025-01-21',
      assignedTo: 'Admin User',
      adminNotes: 'Contacted both parties. Arranging mediation call.',
    },
    {
      id: 3,
      category: 'Profile Violation',
      priority: 'normal',
      subject: 'Student not fulfilling agreed tasks',
      description: 'The student agreed to help with grocery shopping twice a week but has only done it once in the past month. They are often unavailable.',
      reportedBy: {
        name: 'Margaret Thompson',
        email: 'margaret.t@email.com',
        phone: '07XXX 456 789',
        userType: 'host',
      },
      reportedAbout: {
        name: 'Ahmed M.',
        email: 'ahmed.m@imperial.ac.uk',
        userType: 'student',
      },
      status: 'pending',
      submittedDate: '2025-01-20',
      assignedTo: null,
    },
    {
      id: 4,
      category: 'Technical Issue',
      priority: 'normal',
      subject: 'Cannot upload DBS certificate',
      description: 'I have been trying to upload my DBS certificate for 3 days but the upload keeps failing. I have tried different file formats (PDF and JPG) and different browsers.',
      reportedBy: {
        name: 'David Brown',
        email: 'david.b@email.com',
        phone: '07XXX 222 333',
        userType: 'host',
      },
      reportedAbout: null,
      status: 'resolved',
      submittedDate: '2025-01-18',
      resolvedDate: '2025-01-19',
      assignedTo: 'Support Team',
      adminNotes: 'File size was too large. User helped to compress file. Issue resolved.',
      resolution: 'Technical support provided. File upload successful.',
    },
    {
      id: 5,
      category: 'Scam or Fraud',
      priority: 'urgent',
      subject: 'Suspicious profile requesting money',
      description: 'A user claiming to be a host asked me to send money upfront for "room reservation". This seems suspicious as the platform doesn\'t require payment.',
      reportedBy: {
        name: 'Lucy Chen',
        email: 'lucy.c@lse.ac.uk',
        phone: '07XXX 444 555',
        userType: 'student',
      },
      reportedAbout: {
        name: 'Suspected Scammer',
        email: 'fake@email.com',
        userType: 'host',
      },
      status: 'resolved',
      submittedDate: '2025-01-17',
      resolvedDate: '2025-01-17',
      assignedTo: 'Admin User',
      adminNotes: 'Scam confirmed. Profile deleted. User blocked. Reported student protected.',
      resolution: 'Fraudulent account removed. All users contacted by this account have been notified.',
    },
  ];

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const categories = [
    'Safety Concern',
    'Inappropriate Behavior',
    'Scam or Fraud',
    'Profile Violation',
    'Technical Issue',
    'Other',
  ];

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleAssignToMe = (reportId) => {
    // TODO: Implement API call
    alert(`Report ${reportId} assigned to you`);
  };

  const handleResolve = (reportId) => {
    const resolution = prompt('Enter resolution details:');
    if (resolution) {
      // TODO: Implement API call
      alert(`Report ${reportId} marked as resolved`);
    }
  };

  const handleEscalate = (reportId) => {
    const reason = prompt('Enter escalation reason:');
    if (reason) {
      // TODO: Implement API call
      alert(`Report ${reportId} escalated to senior admin`);
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      urgent: 'bg-red-100 text-red-800',
      normal: 'bg-blue-100 text-blue-800',
    };
    const icons = {
      urgent: <ShieldAlert className="w-3 h-3" />,
      normal: <Flag className="w-3 h-3" />,
    };
    return (
      <span className={`badge ${styles[priority]} flex items-center space-x-1`}>
        {icons[priority]}
        <span className="capitalize">{priority}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      reviewing: <Eye className="w-3 h-3" />,
      resolved: <CheckCircle className="w-3 h-3" />,
    };
    return (
      <span className={`badge ${styles[status]} flex items-center space-x-1`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  if (!hasPermission('view_reports')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Reports Management
          </h1>
          <p className="text-lg text-gray-600">
            Review and manage user-submitted reports and concerns
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Total Reports</p>
            <span className="text-3xl font-bold text-gray-900">{reports.length}</span>
          </div>
          <div className="card p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <span className="text-3xl font-bold text-yellow-600">
              {reports.filter((r) => r.status === 'pending').length}
            </span>
          </div>
          <div className="card p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-1">Urgent</p>
            <span className="text-3xl font-bold text-red-600">
              {reports.filter((r) => r.priority === 'urgent' && r.status !== 'resolved').length}
            </span>
          </div>
          <div className="card p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Resolved (7 days)</p>
            <span className="text-3xl font-bold text-green-600">
              {reports.filter((r) => r.status === 'resolved').length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  placeholder="Search reports..."
                  className="input-field pl-10"
                  aria-label="Search reports"
                />
              </div>
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
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="input-field"
                aria-label="Filter by priority"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent Only</option>
                <option value="normal">Normal Only</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`card p-6 ${
                report.priority === 'urgent' && report.status !== 'resolved'
                  ? 'border-l-4 border-red-500'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{report.subject}</h3>
                    {getPriorityBadge(report.priority)}
                    {getStatusBadge(report.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="badge bg-gray-100 text-gray-800">{report.category}</span>
                    <span>Submitted: {new Date(report.submittedDate).toLocaleDateString('en-GB')}</span>
                    {report.assignedTo && (
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>Assigned to: {report.assignedTo}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-600">Reported by: </span>
                      <span className="font-medium text-gray-900">
                        {report.reportedBy.name} ({report.reportedBy.userType})
                      </span>
                    </div>
                    {report.reportedAbout && (
                      <div>
                        <span className="text-gray-600">About: </span>
                        <span className="font-medium text-gray-900">
                          {report.reportedAbout.name} ({report.reportedAbout.userType})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewReport(report)}
                  className="btn-outline flex items-center space-x-1 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {report.status === 'pending' && (
                  <button
                    onClick={() => handleAssignToMe(report.id)}
                    className="btn-outline flex items-center space-x-1 text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Assign to Me</span>
                  </button>
                )}
                {report.status !== 'resolved' && hasPermission('moderate_content') && (
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="btn-primary flex items-center space-x-1 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Resolved</span>
                  </button>
                )}
                {report.priority === 'urgent' && report.status !== 'resolved' && (
                  <button
                    onClick={() => handleEscalate(report.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Escalate</span>
                  </button>
                )}
              </div>

              {/* Resolution Info */}
              {report.status === 'resolved' && report.resolution && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-1">Resolution:</p>
                  <p className="text-sm text-green-800">{report.resolution}</p>
                  <p className="text-xs text-green-700 mt-2">
                    Resolved: {new Date(report.resolvedDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredReports.length === 0 && (
          <div className="card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Report Detail Modal */}
        {showReportModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {selectedReport.subject}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(selectedReport.priority)}
                    {getStatusBadge(selectedReport.status)}
                    <span className="badge bg-gray-100 text-gray-800">
                      {selectedReport.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Report Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Report Description</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
                  </div>
                </div>

                {/* Reporter Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Reported By</h4>
                  <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{selectedReport.reportedBy.name}</span>
                      <span className="badge badge-blue capitalize">{selectedReport.reportedBy.userType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{selectedReport.reportedBy.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{selectedReport.reportedBy.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Reported About */}
                {selectedReport.reportedAbout && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Reported About</h4>
                    <div className="bg-red-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{selectedReport.reportedAbout.name}</span>
                        <span className="badge badge-purple capitalize">{selectedReport.reportedAbout.userType}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{selectedReport.reportedAbout.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedReport.adminNotes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Admin Notes</h4>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <p className="text-sm text-teal-900">{selectedReport.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Report Submitted</p>
                        <p className="text-xs text-gray-600">
                          {new Date(selectedReport.submittedDate).toLocaleString('en-GB')}
                        </p>
                      </div>
                    </div>
                    {selectedReport.assignedTo && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Assigned to {selectedReport.assignedTo}</p>
                          <p className="text-xs text-gray-600">Status: {selectedReport.status}</p>
                        </div>
                      </div>
                    )}
                    {selectedReport.status === 'resolved' && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Resolved</p>
                          <p className="text-xs text-gray-600">
                            {new Date(selectedReport.resolvedDate).toLocaleString('en-GB')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Close
                  </button>
                  {selectedReport.status !== 'resolved' && (
                    <>
                      <button
                        onClick={() => {
                          handleResolve(selectedReport.id);
                          setShowReportModal(false);
                        }}
                        className="btn-primary flex-1"
                      >
                        Mark Resolved
                      </button>
                      {selectedReport.priority === 'urgent' && (
                        <button
                          onClick={() => {
                            handleEscalate(selectedReport.id);
                            setShowReportModal(false);
                          }}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Escalate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsManagement;
