import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, User as UserIcon, BookOpen, ShieldAlert, CheckCircle, AlertTriangle, AlertCircle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      default:
        return <BookOpen className="h-4 w-4 text-sky-400 shrink-0" />;
    }
  };

  const avatarSrc =
    user?.profileImage ||
    `https://ui-avatars.com/api/?background=2A4365&color=fff&name=${encodeURIComponent(user?.name || 'User')}`;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-200">
          FP
        </div>
        <div className="flex flex-col">
          <span className="text-md font-bold tracking-wider bg-gradient-to-r from-indigo-200 via-slate-100 to-emerald-200 bg-clip-text text-transparent">
            FUTURE PATH
          </span>
          <span className="text-[10px] text-indigo-400/80 tracking-widest font-semibold uppercase leading-none mt-0.5">
            A/L Careers Portal
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications((current) => !current);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-slate-700 transition-all focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black text-white shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">Alert Center</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-500 text-xs">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markNotificationRead(n._id)}
                      className={`px-4 py-3 text-left transition-colors cursor-pointer hover:bg-slate-800/40 flex gap-3 items-start ${
                        !n.read ? 'bg-indigo-950/10' : ''
                      }`}
                    >
                      {getNotificationIcon(n.type)}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-200 font-medium leading-normal">
                          {n.message}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setShowProfileMenu((current) => !current);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-slate-200 hover:border-indigo-500 transition-all"
          >
            <img src={avatarSrc} alt="Profile" className="h-9 w-9 rounded-full object-cover border border-slate-700" />
            <span className="hidden md:inline text-sm font-semibold">{user?.name}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Hello,</p>
                <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
              </div>
              <div className="flex flex-col text-sm">
                <Link
                  to="/profile"
                  className="px-4 py-3 hover:bg-slate-900/80 text-slate-200 font-medium"
                  onClick={() => setShowProfileMenu(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-3 hover:bg-slate-900/80 text-slate-200 font-medium"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Edit Profile
                </Link>
                <Link
                  to="/my-courses"
                  className="px-4 py-3 hover:bg-slate-900/80 text-slate-200 font-medium"
                  onClick={() => setShowProfileMenu(false)}
                >
                  My Courses
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-3 hover:bg-slate-900/80 text-rose-400 font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
