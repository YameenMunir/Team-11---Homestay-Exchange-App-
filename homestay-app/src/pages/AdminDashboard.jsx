import { useState } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Home,
  GraduationCap,
  Search,
  Filter,
  Link2,
  Mail,
  Phone,
  MapPin,
  Download,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('verifications');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);

  // Mock data
  const stats = {
    pendingVerifications: 12,
    connectionRequests: 8,
    activeArrangements: 45,
    totalUsers: 234,
  };

  const pendingVerifications = [
    {
      id: 1,
      type: 'host',
      name: 'Robert Anderson',
      email: 'robert.a@email.com',
      phone: '07XXX 123 456',
      address: '123 Main Street, London',
      postcode: 'SW1A 1AA',
      submittedDate: '2025-01-18',
      documents: {
        idDocument: {
          filename: 'passport_robert_anderson.pdf',
          uploadDate: '2025-01-18',
          status: 'pending',
          url: '#',
        },
        addressProof: {
          filename: 'utility_bill_jan_2025.pdf',
          uploadDate: '2025-01-18',
          status: 'pending',
          url: '#',
        },
        dbsCheck: {
          filename: 'dbs_check_robert.pdf',
          uploadDate: '2025-01-18',
          status: 'pending',
          url: '#',
        },
      },
      servicesNeeded: ['Garden Help', 'Technology Help', 'Grocery Shopping'],
    },
    {
      id: 2,
      type: 'student',
      name: 'Emma Wilson',
      email: 'emma.w@ucl.ac.uk',
      phone: '07XXX 789 012',
      university: 'University College London',
      course: 'Computer Science',
      yearOfStudy: '2',
      submittedDate: '2025-01-19',
      documents: {
        idDocument: {
          filename: 'passport_emma_wilson.pdf',
          uploadDate: '2025-01-19',
          status: 'pending',
          url: '#',
        },
        admissionLetter: {
          filename: 'ucl_admission_letter.pdf',
          uploadDate: '2025-01-19',
          status: 'pending',
          url: '#',
        },
      },
      servicesOffered: ['Companionship', 'Light Cleaning', 'Technology Help'],
    },
  ];

  const connectionRequests = [
    {
      id: 1,
      studentName: 'Sarah K.',
      studentEmail: 'sarah.k@ucl.ac.uk',
      hostName: 'Margaret Thompson',
      hostEmail: 'margaret.t@email.com',
      requestDate: '2025-01-15',
      status: 'pending',
      message: 'Hello! I\'m a Computer Science student at UCL and I\'d love to help with technology assistance and companionship.',
      matchScore: 95,
    },
    {
      id: 2,
      studentName: 'Ahmed M.',
      studentEmail: 'ahmed.m@imperial.ac.uk',
      hostName: 'Robert Davies',
      hostEmail: 'robert.d@email.com',
      requestDate: '2025-01-18',
      status: 'pending',
      message: 'Hi! I\'m studying Medicine and would be happy to help with light cleaning and grocery shopping.',
      matchScore: 88,
    },
    {
      id: 3,
      studentName: 'Lucy Chen',
      studentEmail: 'lucy.c@lse.ac.uk',
      hostName: 'Elizabeth Brown',
      hostEmail: 'elizabeth.b@email.com',
      requestDate: '2025-01-20',
      status: 'approved',
      message: 'Hello! I\'m an Engineering student interested in providing companionship and garden help.',
      matchScore: 92,
      approvedDate: '2025-01-21',
      adminNote: 'Good match, both verified.',
    },
  ];

  const handleApproveDocument = (userId, documentType) => {
    alert(`Approved ${documentType} for user ${userId}`);
  };

  const handleRejectDocument = (userId, documentType) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      alert(`Rejected ${documentType} for user ${userId}. Reason: ${reason}`);
    }
  };

  const handleApproveConnection = (requestId) => {
    alert(`Approved connection request ${requestId}. Contact details will be shared with both parties.`);
  };

  const handleRejectConnection = (requestId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      alert(`Rejected connection request ${requestId}. Reason: ${reason}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage verifications, connection requests, and platform operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Verifications</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.pendingVerifications}
                </span>
              </div>
              <UserCheck className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Connection Requests</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.connectionRequests}
                </span>
              </div>
              <Link2 className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Arrangements</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.activeArrangements}
                </span>
              </div>
              <Home className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <span className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </span>
              </div>
              <Users className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('verifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'verifications'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Document Verifications ({pendingVerifications.length})
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'connections'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Connection Requests ({connectionRequests.filter(r => r.status === 'pending').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            {pendingVerifications.map((user) => (
              <div key={user.id} className="card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      user.type === 'host' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {user.type === 'host' ? (
                        <Home className="w-6 h-6 text-purple-600" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className={`badge ${user.type === 'host' ? 'badge-purple' : 'badge-blue'}`}>
                          {user.type === 'host' ? 'Host' : 'Student'}
                        </span>
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                        {user.address && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{user.address}, {user.postcode}</span>
                          </div>
                        )}
                        {user.university && (
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4" />
                            <span>{user.university} - {user.course} (Year {user.yearOfStudy})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(user.submittedDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Documents to Review:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(user.documents).map(([docType, doc]) => (
                      <div key={docType} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 capitalize">
                                {docType.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(doc.uploadDate).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                          </div>
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <p className="text-xs text-gray-700 mb-3 truncate">
                          {doc.filename}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(doc.url, '_blank')}
                            className="flex-1 text-xs px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleApproveDocument(user.id, docType)}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectDocument(user.id, docType)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Services */}
                  {user.servicesNeeded && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Services Needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {user.servicesNeeded.map((service) => (
                          <span key={service} className="badge bg-purple-100 text-purple-800">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.servicesOffered && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Services Offered:</p>
                      <div className="flex flex-wrap gap-2">
                        {user.servicesOffered.map((service) => (
                          <span key={service} className="badge bg-blue-100 text-blue-800">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Approve All / Reject All */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => alert(`Approved all documents for ${user.name}`)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve All Documents</span>
                    </button>
                    <button
                      onClick={() => alert(`Rejected verification for ${user.name}`)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject Verification</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connection Requests Tab */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            {connectionRequests.map((request) => (
              <div key={request.id} className={`card p-6 ${
                request.status === 'approved' ? 'bg-green-50 border-2 border-green-200' : ''
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {request.studentName} → {request.hostName}
                      </h3>
                      {request.status === 'approved' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Student:</p>
                        <p>{request.studentEmail}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Host:</p>
                        <p>{request.hostEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <span className="badge badge-purple">Match Score: {request.matchScore}%</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Requested: {new Date(request.requestDate).toLocaleDateString('en-GB')}
                    </p>
                    {request.approvedDate && (
                      <p className="text-xs text-green-600 font-medium">
                        Approved: {new Date(request.approvedDate).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Student Message */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Student's Message:</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {request.message}
                  </p>
                </div>

                {request.status === 'approved' && request.adminNote && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-green-900 mb-1">Admin Note:</p>
                    <p className="text-green-800 text-sm">{request.adminNote}</p>
                  </div>
                )}

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApproveConnection(request.id)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Approve & Share Contact Details</span>
                    </button>
                    <button
                      onClick={() => handleRejectConnection(request.id)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                )}

                {request.status === 'approved' && (
                  <div className="pt-4 border-t border-green-200">
                    <p className="text-sm text-green-800">
                      ✓ Connection approved. Both parties have been notified and admin contact details shared.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
