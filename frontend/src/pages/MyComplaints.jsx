import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/api';
import { ChevronLeft, Info, Calendar, User, Eye, X } from 'lucide-react';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const list = await complaintService.getMyComplaints();
      setComplaints(list);
    } catch (err) {
      // Error fetching
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Medium</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Low</span>;
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Resolved':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Resolved</span>;
      case 'Assigned':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">Assigned</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center space-x-1 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors mb-2 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Complaints</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium bg-white rounded-xl shadow-sm border border-gray-100">
          Loading complaints history...
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No complaints filed yet</h3>
          <p className="text-sm text-gray-500 mb-6">If you are facing any issues, file your first grievance now.</p>
          <button
            onClick={() => navigate('/student/submit')}
            className="bg-college-600 hover:bg-college-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition-colors cursor-pointer"
          >
            File Complaint
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Staff</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 flex items-center space-x-1.5">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(c.createdDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{c.title}</td>
                    <td className="px-6 py-4 text-gray-500">{c.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(c.priority)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(c.status)}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {c.assignedStaff ? (
                        <span className="flex items-center space-x-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{c.assignedStaff}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-college-600 hover:text-college-800 font-semibold">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="inline-flex items-center space-x-1 text-sm bg-college-50 hover:bg-college-100 text-college-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2">
              Grievance Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold mb-4 bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="text-gray-500">Category:</span>{' '}
                <span className="text-gray-900">{selectedComplaint.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>{' '}
                <span>{getStatusBadge(selectedComplaint.status)}</span>
              </div>
              <div>
                <span className="text-gray-500">Priority:</span>{' '}
                <span>{getPriorityBadge(selectedComplaint.priority)}</span>
              </div>
              <div>
                <span className="text-gray-500">Filed On:</span>{' '}
                <span className="text-gray-900">{new Date(selectedComplaint.createdDate).toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-1">Subject</h4>
              <p className="text-gray-900 text-sm font-semibold">{selectedComplaint.title}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-1">Description</h4>
              <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-line leading-relaxed">
                {selectedComplaint.description}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-700">
                <span className="font-bold">Assigned Staff Officer:</span>
                <span className="font-semibold text-college-700 bg-college-50 px-2.5 py-1 rounded-md">
                  {selectedComplaint.assignedStaff || 'Pending Assignment'}
                </span>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
