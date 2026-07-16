import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { School, ShieldCheck, Clock, BookOpen, HeartHandshake, Mail, Lock, AlertCircle, LogOut, User, LayoutDashboard } from 'lucide-react';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      setUser(data);
      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Upper Main section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Column: Intro */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-college-50 text-college-700 px-3.5 py-1.5 rounded-full text-sm font-semibold border border-college-100">
            <School className="h-4 w-4" />
            <span>Official College Portal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Grievance & Complaint Redressal Portal
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed font-light">
            Welcome to the centralized College Complaint Management System. Our portal provides a secure, structured, and transparent channel for engineering students to register grievances and track resolution updates in real time.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white text-college-600 rounded-lg shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Secure Filing</h4>
                <p className="text-xs text-gray-500">Only verified profiles</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white text-college-600 rounded-lg shadow-sm">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Live Track</h4>
                <p className="text-xs text-gray-500">Real-time milestones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Form Panel */}
        <div className="w-full md:w-1/2 max-w-md mx-auto">
          {user ? (
            /* Logged In Card State */
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-college-50 text-college-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Welcome Back!</h3>
                <p className="text-sm text-gray-500 mt-1">You are currently logged into the system.</p>
              </div>

              {/* Profile Brief */}
              <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2 border border-gray-100">
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Name:</span>
                  <span className="text-gray-900 font-semibold">{user.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Email:</span>
                  <span className="text-gray-900 font-semibold">{user.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 font-medium">Role:</span>
                  <span className="text-college-700 font-bold bg-college-50 px-2 py-0.5 rounded text-xs uppercase">
                    {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}
                  </span>
                </p>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  to={user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                  className="w-full bg-college-600 hover:bg-college-700 text-white text-center font-bold py-2.5 rounded-lg shadow transition-colors flex items-center justify-center space-x-2"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Switch Account / Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form State */
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Portal Sign In</h2>
                <p className="text-sm text-gray-500 mt-1">Access student or administrator features</p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-start space-x-2 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <Mail className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email.."
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-college-500 focus:border-college-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-college-500 focus:border-college-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-college-600 hover:bg-college-700 text-white font-bold py-2.5 rounded-lg shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                New Student?{' '}
                <Link to="/register" className="font-semibold text-college-600 hover:text-college-500 transition-colors">
                  Register Account
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Feature Objectives */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Use This Portal?</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
              Ensuring a healthy, safe, and academically focused atmosphere for all campus members.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <div className="inline-flex p-3 bg-college-50 text-college-600 rounded-lg mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Verified</h3>
              <p className="text-sm text-gray-500">
                Only authenticated engineering students can submit, and all grievances are officially monitored.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <div className="inline-flex p-3 bg-college-50 text-college-600 rounded-lg mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Categorized</h3>
              <p className="text-sm text-gray-500">
                Structured filing under Hostel, Academics, Library, Transport, and other categories.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <div className="inline-flex p-3 bg-college-50 text-college-600 rounded-lg mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Administration</h3>
              <p className="text-sm text-gray-500">
                Administration reviews every case, assigns staff members, and guarantees timely resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
