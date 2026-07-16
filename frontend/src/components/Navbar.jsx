import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { School, LogOut, User, LayoutDashboard, FileText, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-college-800 to-college-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <School className="h-8 w-8 text-de-100" />
            <span className="font-bold text-xl tracking-wide">College Grievance Portal</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'ROLE_STUDENT' ? (
                  <>
                    <Link
                      to="/student/dashboard"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-college-700 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/student/submit"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-college-700 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Submit Complaint</span>
                    </Link>
                    <Link
                      to="/student/my-complaints"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-college-700 transition-colors"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>My Complaints</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-college-700 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Profile Badge & Logout */}
                <div className="flex items-center pl-4 border-l border-college-500 space-x-4">
                  <div className="flex items-center space-x-2 bg-college-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <User className="h-3.5 w-3.5" />
                    <span>{user.name}</span>
                    <span className="bg-white text-college-800 px-1.5 py-0.5 rounded-md text-[10px] uppercase font-bold">
                      {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-college-700 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-college-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-college-700 hover:bg-college-50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
