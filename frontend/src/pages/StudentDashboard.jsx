import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import { GraduationCap, Clock, CheckCircle2, XCircle, Calendar, CreditCard, Bell, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const fetchStudentDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/registrations');
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Error pulling dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDashboardData();
  }, []);

  // Compute metrics
  const totalCount = registrations.length;
  const approvedCount = registrations.filter((r) => r.status === 'approved').length;
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 shadow-sm glow-dot-approved">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-950/80 border border-rose-500/30 text-rose-300 shadow-sm glow-dot-rejected">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-950/80 border border-amber-500/30 text-amber-300 shadow-sm glow-dot-pending">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 animate-ping" />
            Pending Review
          </span>
        );
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'approved':
        return 'Congratulations! Your application has been approved. A Future Path administrative coordinator will contact you via email or phone within 24 hours to schedule your induction and payment details.';
      case 'rejected':
        return 'We regret to inform you that your application could not be approved at this time. This is typically due to cohort capacity constraints or requirements mismatch. Please feel free to register for another program!';
      default:
        return 'Your registration is currently under review by our admission coordinators. We are validating your G.C.E. A/L stream details. We will notify you here once a decision is finalized.';
    }
  };

  if (loading) {
    return (
      <div className="py-32">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Visual Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-xs text-slate-400 font-medium leading-none">
          Manage your registrations, view admission approvals, and track career programs.
        </p>
      </div>

      {/* Metric KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-5 shadow-md flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Programs Applied</span>
            <span className="text-xl font-extrabold text-white mt-1">{totalCount}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-5 shadow-md flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Approved Courses</span>
            <span className="text-xl font-extrabold text-white mt-1">{approvedCount}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-5 shadow-md flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending Decisions</span>
            <span className="text-xl font-extrabold text-white mt-1">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Main Registrations Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>Active Applications</span>
        </h2>

        {registrations.length === 0 ? (
          <div className="glass-panel border border-slate-900 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <Inbox className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No Registrations Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              You haven't submitted any admissions applications yet. Explore our career programs catalog and register today!
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Browse Course Catalog &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg) => {
              const formattedDate = new Date(reg.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const formattedFee = new Intl.NumberFormat('en-LK', {
                style: 'currency',
                currency: 'LKR',
                maximumFractionDigits: 0,
              }).format(reg.course?.fee || 0);

              return (
                <div
                  key={reg._id}
                  className="glass-panel border border-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-lg"
                >
                  {/* Left Column: Course Banner */}
                  <div className="h-24 w-full md:w-36 rounded-2xl overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src={reg.course?.image}
                      alt={reg.course?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Middle Column: Details */}
                  <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-400 font-bold uppercase tracking-wider">
                          {reg.course?.category}
                        </span>
                        <h3 className="text-base md:text-lg font-bold text-slate-100 mt-1">
                          {reg.course?.title}
                        </h3>
                      </div>
                      {/* Status pill */}
                      <div>{getStatusBadge(reg.status)}</div>
                    </div>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        Applied: {formattedDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-emerald-400" />
                        Tuition investment: {formattedFee}
                      </span>
                    </div>

                    {/* Notification/Decision description */}
                    <p className="text-xs text-slate-400 pl-4 border-l-2 border-slate-800 leading-relaxed font-light">
                      {getStatusDescription(reg.status)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default StudentDashboard;
