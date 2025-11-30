import { useState } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  User,
  Calendar,
  FileText,
} from 'lucide-react';

const AdminDisputes = () => {
  const [activeTab, setActiveTab] = useState('open'); // open, resolved, all

  // Placeholder data - Replace with real data from Supabase
  const disputes = [
    {
      id: 1,
      type: 'Service Quality',
      reporter: 'Sarah K.',
      reporterType: 'student',
      against: 'Margaret Thompson',
      againstType: 'host',
      status: 'open',
      priority: 'high',
      submittedDate: '2025-01-20',
      description: 'Host did not provide agreed upon services...',
    },
    {
      id: 2,
      type: 'Payment Dispute',
      reporter: 'Robert Anderson',
      reporterType: 'host',
      against: 'Emma Wilson',
      againstType: 'student',
      status: 'under_investigation',
      priority: 'medium',
      submittedDate: '2025-01-22',
      description: 'Student has not completed required hours...',
    },
  ];

  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return d.status === 'open' || d.status === 'under_investigation';
    if (activeTab === 'resolved') return d.status === 'resolved';
    return true;
  });

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-red-100 text-red-800',
      under_investigation: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`badge ${styles[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`badge ${styles[priority]}`}>
        {priority.toUpperCase()} PRIORITY
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Dispute Management
          </h1>
          <p className="text-lg text-gray-600">
            Handle and resolve user disputes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Open Disputes</p>
            <span className="text-3xl font-bold text-red-600">
              {disputes.filter(d => d.status === 'open').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Under Investigation</p>
            <span className="text-3xl font-bold text-yellow-600">
              {disputes.filter(d => d.status === 'under_investigation').length}
            </span>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">Resolved</p>
            <span className="text-3xl font-bold text-green-600">
              {disputes.filter(d => d.status === 'resolved').length}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('open')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'open'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Open ({disputes.filter(d => d.status === 'open' || d.status === 'under_investigation').length})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'resolved'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resolved ({disputes.filter(d => d.status === 'resolved').length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Disputes ({disputes.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Disputes List */}
        {filteredDisputes.length === 0 ? (
          <div className="card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No disputes found
            </h3>
            <p className="text-gray-600">
              There are no {activeTab === 'all' ? '' : activeTab} disputes at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <div key={dispute.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {dispute.type}
                        </h3>
                        {getStatusBadge(dispute.status)}
                        {getPriorityBadge(dispute.priority)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{dispute.reporter} ({dispute.reporterType})</span>
                        </span>
                        <span>vs</span>
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{dispute.against} ({dispute.againstType})</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{dispute.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {new Date(dispute.submittedDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  {dispute.status !== 'resolved' && (
                    <>
                      <button className="btn-primary flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Investigate</span>
                      </button>
                      <button className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Resolve</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Placeholder Notice */}
        <div className="mt-8 card p-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Development Note</h4>
              <p className="text-sm text-blue-800">
                This page displays placeholder data. Integration with the disputes database table is pending.
                Full dispute management workflow including investigation, mediation, and resolution actions
                will be implemented in the next phase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDisputes;
