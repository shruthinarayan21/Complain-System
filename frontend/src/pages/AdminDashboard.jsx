import React, { useEffect, useState } from 'react';
import { complaintService } from '../services/api';
import { ClipboardList, CheckCircle, Clock, Eye, X, User, ShieldAlert, Edit3 } from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, resolved: 0 });

  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal / Editing state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [staffName, setStaffName] = useState('');
  const [statusVal, setStatusVal] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, filterCategory, filterPriority, filterStatus]);

  const fetchComplaints = async () => {
    try {
      const list = await complaintService.getAllComplaints();
      setComplaints(list);
      
      const counts = list.reduce((acc, c) => {
        acc.total += 1;
        const status = c.status?.toLowerCase();
        if (status === 'pending') acc.pending += 1;
        else if (status === 'assigned') acc.assigned += 1;
        else if (status === 'resolved') acc.resolved += 1;
        return acc;
      }, { total: 0, pending: 0, assigned: 0, resolved: 0 });
      setStats(counts);
    } catch (err) {
      // Silent error
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...complaints];
    if (filterCategory !== 'All') {
      list = list.filter(c => c.category === filterCategory);
    }
    if (filterPriority !== 'All') {
      list = list.filter(c => c.priority === filterPriority);
    }
    if (filterStatus !== 'All') {
      list = list.filter(c => c.status === filterStatus);
    }
    setFilteredComplaints(list);
  };

  const handleOpenDetails = (c) => {
    setSelectedComplaint(c);
    setStaffName(c.assignedStaff || '');
    setStatusVal(c.status || 'Pending');
    setUpdateSuccess('');
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateSuccess('');
    try {
      const updated = await complaintService.updateComplaint(selectedComplaint.id, statusVal, staffName);
      
      // Update local state list
      setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedComplaint(updated); // Update detail view
      
      setUpdateSuccess('Complaint updated successfully!');
      setTimeout(() => {
        setUpdateSuccess('');
      }, 2000);
      
      // Refresh list to recalculate stats
      fetchComplaints();
    } catch (err) {
      // Handle error
    } finally {
      setUpdateLoading(false);
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded-full">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Low</span>;
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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
          <ShieldAlert className="h-8 w-8 text-college-700" />
          <span>Admin Complaint Dashboard</span>
        </h1>
        <p className="mt-1 text-gray-500">
          Manage all college student grievances, assign staff officers, and resolve complaints.
        </p>
      </div>

      {/* Stats row */}
      {loading ? (
        <div className="text-center py-6 text-gray-500 font-medium">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-college-50 text-college-600 rounded-lg">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Grievances</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Pending Actions</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Edit3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Assigned Staff</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.assigned}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Resolved Cases</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.resolved}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Filters row */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Filter by Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-college-500"
          >
            <option value="All">All Categories</option>
            <option value="Academics">Academics</option>
            <option value="Hostel">Hostel</option>
            <option value="Transport">Transport</option>
            <option value="Library">Library</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Filter by Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-college-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-college-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          Loading grievances...
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm font-semibold">No complaints match the current filter selection.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Staff</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-950">{c.user?.name}</div>
                      <div className="text-xs text-gray-400 font-medium">{c.user?.email}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                      <button
                        onClick={() => handleOpenDetails(c)}
                        className="inline-flex items-center space-x-1 text-sm bg-college-600 hover:bg-college-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Manage Case</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details/Edit Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-2 flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-college-700" />
              <span>Grievance File #{selectedComplaint.id}</span>
            </h2>

            {/* Student Info */}
            <div className="bg-college-50 p-4 rounded-lg flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-college-100 rounded-full text-college-700">
                <User className="h-6 w-6" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Student: {selectedComplaint.user?.name}</p>
                <p className="text-xs text-college-800 font-medium">Email: {selectedComplaint.user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold mb-4 bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="text-gray-500">Category:</span>{' '}
                <span className="text-gray-900">{selectedComplaint.category}</span>
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

            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-1">Description</h4>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                {selectedComplaint.description}
              </p>
            </div>

            {/* Action Form */}
            <form onSubmit={handleUpdateComplaint} className="border-t border-gray-100 pt-4 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center space-x-1">
                <span>Update Grievance Action</span>
              </h4>

              {updateSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded-md text-xs font-semibold">
                  {updateSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-college-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Assign Staff Officer</label>
                  <input
                    type="text"
                    required={statusVal === 'Assigned' || statusVal === 'Resolved'}
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="Enter staff name only"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-college-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2 bg-college-600 hover:bg-college-700 text-white rounded-lg text-sm font-bold shadow transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
