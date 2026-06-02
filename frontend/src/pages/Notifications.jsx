import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import { Bell, CheckCircle2, Clock, Inbox, Mail, Globe, MapPin, Phone } from 'lucide-react';

const Notifications = () => {
  const { notifications, unreadCount, fetchNotifications, markNotificationRead, markAllNotificationsRead, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        await fetchNotifications();
      } catch (error) {
        triggerToast('Unable to load notifications at the moment.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [fetchNotifications]);

  return (
    <div className="space-y-8 animate-fade-in text-left pb-16">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Notification Center</h1>
          <p className="text-xs text-slate-400">
            {user?.role === 'admin'
              ? 'Review alert messages related to course contact requests and admin actions.'
              : 'Track your course contact requests, incoming organization contact details, and updates from the admin team.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-300">
            <Bell className="h-4 w-4 text-indigo-400" />
            {unreadCount} Unread
          </div>
          <button
            onClick={markAllNotificationsRead}
            className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24">
          <Spinner size="large" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-800 p-12 text-center text-slate-400">
          <Inbox className="mx-auto h-10 w-10 text-slate-500 mb-4" />
          <h2 className="text-lg font-bold text-white">No Notifications Yet</h2>
          <p className="text-xs text-slate-500 mt-2">Once the admin sends organization contact details or updates your request, you will see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`glass-panel border border-slate-800 rounded-3xl p-5 transition-colors ${notification.read ? 'bg-slate-950' : 'bg-indigo-950/10 border-indigo-500/30'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300">
                      {notification.type === 'success' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                      {notification.type === 'warning' && <Clock className="h-3.5 w-3.5 text-amber-400" />}
                      {notification.type === 'error' && <Mail className="h-3.5 w-3.5 text-rose-400" />}
                      {notification.type === 'info' && <Bell className="h-3.5 w-3.5 text-sky-400" />}
                      {notification.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{notification.message}</p>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationRead(notification._id)}
                      className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>

              {notification.payload?.organizationContact && (
                <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                  <h4 className="text-sm font-bold text-white mb-2">Organization Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-indigo-400" /> <span>{notification.payload.organizationContact.website || 'No website provided'}</span></div>
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-400" /> <span>{notification.payload.organizationContact.phone}</span></div>
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-sky-400" /> <span>{notification.payload.organizationContact.email}</span></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> <span>{notification.payload.organizationContact.address || 'No address provided'}</span></div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> <span>{notification.payload.courseName}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />}
    </div>
  );
};

export default Notifications;
