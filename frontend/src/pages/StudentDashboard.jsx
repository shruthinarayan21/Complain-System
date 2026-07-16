import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintService, authService } from '../services/api';
import { ClipboardList, PlusCircle, CheckCircle, Clock, Send, AlertTriangle } from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const list = await complaintService.getMyComplaints();
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
    fetchComplaints();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Welcome back, {user?.name}. Check your complaint status or file a new grievance.
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
              <p className="text-sm font-semibold text-gray-500">Total Filed</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Send className="h-6 w-6" />
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
              <p className="text-sm font-semibold text-gray-500">Resolved</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.resolved}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="p-4 bg-college-50 text-college-600 rounded-xl inline-flex mb-6">
              <PlusCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Submit New Grievance</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              File a official grievance regarding Academics, Hostel facilities, Library issues, college Transport, or others. Choose your priority status to alert administration.
            </p>
          </div>
          <Link
            to="/student/submit"
            className="w-full bg-college-600 hover:bg-college-700 text-white text-center font-bold py-3 rounded-lg shadow transition-colors inline-block cursor-pointer"
          >
            File a Complaint
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="p-4 bg-college-50 text-college-600 rounded-xl inline-flex mb-6">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Complaints</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Review history of all your submitted complaints, verify assigned officers/staff members, and view solutions or remarks posted by the college administrators.
            </p>
          </div>
          <Link
            to="/student/my-complaints"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white text-center font-bold py-3 rounded-lg shadow transition-colors inline-block cursor-pointer"
          >
            View History & Track
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
