import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/api';
import { AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';

const SubmitComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academics');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await complaintService.submitComplaint(title, description, category, priority);
      setSuccess('Complaint submitted successfully! Redirecting...');
      setTimeout(() => {
        navigate('/student/my-complaints');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <button
        onClick={() => navigate('/student/dashboard')}
        className="flex items-center space-x-1 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors mb-6 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <div className="border-b border-gray-100 pb-5 mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">File a New Grievance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Submit a formal grievance regarding campus facilities or services.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 flex items-start space-x-2 text-sm">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Title / Subject
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-college-500 focus:border-college-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-college-500 focus:border-college-500"
              >
                <option value="Academics">Academics</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Library">Library</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-college-500 focus:border-college-500"
              >
                <option value="Low">Low (General suggestion/query)</option>
                <option value="Medium">Medium (Routine grievance)</option>
                <option value="High">High (Urgent action required)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Detailed Description
            </label>
            <textarea
              required
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide all relevant details, times, locations, and facts about the issue..."
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-college-500 focus:border-college-500"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-college-600 hover:bg-college-700 text-white rounded-lg text-sm font-bold shadow transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
