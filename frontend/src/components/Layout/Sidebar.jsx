import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, GraduationCap, LayoutDashboard, Settings, HelpCircle, FileCheck, ShieldAlert, User as UserIcon } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const baseLinkClasses =
    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 group';
  const activeLinkClasses =
    'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-500/5';
  const inactiveLinkClasses =
    'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent';

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-800/80 bg-slate-950/40 p-6 min-h-[calc(100vh-80px)] justify-between">
      {/* Upper Navigation Links */}
      <div className="flex flex-col space-y-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-4 mb-2">
          Discover
        </p>

        {user?.role === 'admin' ? (
          <>
            {/* Admin Dashboard */}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <LayoutDashboard className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Admin Portal</span>
            </NavLink>

            {/* Course Catalog */}
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <BookOpen className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Course Catalog</span>
            </NavLink>

            {/* Contact Request Queue */}
            <NavLink
              to="/admin/contacts"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <ShieldAlert className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Contact Requests</span>
            </NavLink>
          </>
        ) : (
          <>
            {/* Courses Catalog */}
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <BookOpen className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Browse Courses</span>
            </NavLink>

            {/* Student Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <GraduationCap className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>My Dashboard</span>
            </NavLink>

            {/* Profile */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <UserIcon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Profile</span>
            </NavLink>

            {/* My Courses */}
            <NavLink
              to="/my-courses"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <BookOpen className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>My Courses</span>
            </NavLink>

            {/* Notifications */}
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              <ShieldAlert className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Notifications</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Support / Lower Metadata Section */}
      <div className="flex flex-col space-y-4 pt-6 border-t border-slate-900">
        {/* Decorative Badge */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-slate-800/80 p-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-16 w-16 bg-indigo-500/10 rounded-full blur-xl" />
          <h4 className="text-xs font-bold text-slate-200 mb-1">Sri Lanka A/L 2026</h4>
          <p className="text-[10px] text-slate-500 leading-normal">
            Take your first step toward computing, quantity surveying, business, or nursing sciences.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 px-2 font-medium">
          <span>v1.0.0</span>
          <span>Future Path Corp</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
