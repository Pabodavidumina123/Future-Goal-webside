import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import { Calendar, Clock, Briefcase, ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const triggerToast = (message, type = 'success') => {
    setToastMsg(message);
    setToastType(type);
  };

  useEffect(() => {
    const loadMyCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/registrations');
        if (res.data.success) {
          setCourses(res.data.registrations);
        }
      } catch (error) {
        triggerToast(error.response?.data?.message || 'Unable to load your courses.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="py-28">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">My Courses</h1>
        <p className="text-sm text-slate-400">Track your enrollments, approvals, and upcoming program details.</p>
      </div>

      {courses.length === 0 ? (
        <div className="glass-panel border border-slate-900 rounded-3xl p-12 text-center">
          <Briefcase className="mx-auto mb-4 h-10 w-10 text-slate-500" />
          <h2 className="text-base font-bold text-slate-100">No Enrolled Courses Yet</h2>
          <p className="text-xs text-slate-500 mt-2">Browse the catalog and reserve your seat in the course that matches your career path.</p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-3xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
          >
            Explore Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {courses.map((registration) => {
            const course = registration.course || {};
            const createdAt = new Date(registration.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const statusClass = registration.status === 'approved'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : registration.status === 'rejected'
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30';

            return (
              <div key={registration._id} className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{course.category}</span>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
                        {registration.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-slate-100">{course.title}</h2>
                      <p className="text-sm text-slate-400 line-clamp-2">{course.description}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        Registered: {createdAt}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-400" />
                        Duration: {course.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        Seats left: {course.availableSeats ?? 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[180px]">
                    <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-300">
                      <p className="font-semibold text-slate-200">Contact</p>
                      <p>{course.email}</p>
                      <p>{course.contactNumber}</p>
                    </div>
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />}
    </div>
  );
};

export default MyCourses;
