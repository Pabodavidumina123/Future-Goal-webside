import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import Modal from '../components/Common/Modal';
import { LayoutDashboard, Users, FileCheck, Clock, CheckCircle2, XCircle, Search, SlidersHorizontal, Eye, Trash2, ShieldAlert, Award, FileText, Calendar, Inbox } from 'lucide-react';
import confetti from 'canvas-confetti';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Drawer / Detail Modal
  const [selectedReg, setSelectedReg] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Toast Alerts
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // Fetch registrations
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/registrations');
      if (res.data.success) {
        setRegistrations(res.data.registrations);
        setFilteredRegistrations(res.data.registrations);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Error fetching registrations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filter and Search logic
  useEffect(() => {
    let result = [...registrations];

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter((r) => r.status === statusFilter.toLowerCase());
    }

    // Search query
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.fullName?.toLowerCase().includes(query) ||
          r.email?.toLowerCase().includes(query) ||
          r.course?.title?.toLowerCase().includes(query) ||
          r.phone?.includes(query)
      );
    }

    setFilteredRegistrations(result);
  }, [search, statusFilter, registrations]);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.put(`/registrations/${id}/status`, { status: newStatus });
      if (res.data.success) {
        // Confetti on approval!
        if (newStatus === 'approved') {
          confetti({
            particleCount: 150,
            spread: 80,
            colors: ['#10b981', '#34d399', '#a7f3d0']
          });
        }

        triggerToast(`Registration successfully ${newStatus}!`, 'success');
        
        // Update local state directly to prevent full loader flash
        setRegistrations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );

        // If active drawer is viewing this, update details
        if (selectedReg && selectedReg._id === id) {
          setSelectedReg((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to update registration status.', 'error');
    }
  };

  // Handle delete
  const handleDeleteRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this registration record? This will restore seats inventory if approved.')) return;

    try {
      const res = await api.delete(`/registrations/${id}`);
      if (res.data.success) {
        triggerToast('Registration deleted successfully.', 'success');
        setRegistrations((prev) => prev.filter((r) => r._id !== id));
        setIsDetailOpen(false);
        setSelectedReg(null);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to delete record.', 'error');
    }
  };

  // KPI Calculations
  const kpis = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === 'pending').length,
    approved: registrations.filter((r) => r.status === 'approved').length,
    rejected: registrations.filter((r) => r.status === 'rejected').length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 glow-dot-approved">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/40 border border-rose-500/30 text-rose-400 glow-dot-rejected">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/40 border border-amber-500/30 text-amber-400 glow-dot-pending">
            Pending
          </span>
        );
    }
  };

  const formattedLKR = (val) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenDetails = (reg) => {
    setSelectedReg(reg);
    setIsDetailOpen(true);
  };

  if (loading && registrations.length === 0) {
    return (
      <div className="py-32">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left pb-16">
      {/* Top visual head */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <LayoutDashboard className="h-7 w-7 text-indigo-400" />
          <span>Administration Control Board</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Manage Sri Lankan scholar admissions requests, review qualifications details, and execute status modifications.
        </p>
      </div>

      {/* Stats Counter Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Stat 1 */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate">Total Requests</span>
            <span className="text-lg font-extrabold text-white mt-0.5">{kpis.total}</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate">Pending Review</span>
            <span className="text-lg font-extrabold text-white mt-0.5">{kpis.pending}</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate">Approved Scholars</span>
            <span className="text-lg font-extrabold text-white mt-0.5">{kpis.approved}</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400 shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate">Rejected</span>
            <span className="text-lg font-extrabold text-white mt-0.5">{kpis.rejected}</span>
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, course title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border glass-input text-xs"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shrink-0 transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabular Logger List */}
      <div className="glass-panel border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Student Details</th>
                <th className="px-6 py-4">Selected Program</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium space-y-2">
                    <Inbox className="h-8 w-8 mx-auto text-slate-700" />
                    <p>No admission requests matching filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const appliedDate = new Date(reg.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={reg._id} className="hover:bg-slate-900/20 transition-colors">
                      {/* Student Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-200">{reg.fullName}</span>
                          <span className="text-[10px] text-slate-500">{reg.email}</span>
                          <span className="text-[10px] text-slate-500 leading-none">{reg.phone}</span>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-indigo-300">{reg.course?.title}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {reg.course?.category} ({formattedLKR(reg.course?.fee || 0)})
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-400 font-medium">
                        {appliedDate}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStatusBadge(reg.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Eye button */}
                          <button
                            onClick={() => handleOpenDetails(reg)}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-slate-700 transition-all"
                            title="View qualifications details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Quick action buttons if pending */}
                          {reg.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(reg._id, 'approved')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-bold uppercase"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all text-[10px] font-bold uppercase"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {/* Trash button */}
                          <button
                            onClick={() => handleDeleteRegistration(reg._id)}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900/30 transition-all ml-1"
                            title="Delete record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Slide-Over / Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Scholar Dossier Details"
      >
        {selectedReg && (
          <div className="space-y-6 text-left text-xs font-semibold">
            {/* Header info card */}
            <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Application Status</span>
                <div>{getStatusBadge(selectedReg.status)}</div>
              </div>
              <div className="flex items-center gap-2">
                {selectedReg.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReg._id, 'approved')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all uppercase text-[10px] tracking-wider"
                  >
                    Approve Request
                  </button>
                )}
                {selectedReg.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReg._id, 'rejected')}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all uppercase text-[10px] tracking-wider"
                  >
                    Reject Request
                  </button>
                )}
              </div>
            </div>

            {/* Dossier sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Student info */}
              <div className="glass-panel border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <h4 className="text-slate-300 font-bold flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-1">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span>Personal Credentials</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Full Name</span>
                    <span className="text-slate-200">{selectedReg.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Email Address</span>
                    <span className="text-slate-200 select-all">{selectedReg.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Phone Number</span>
                    <span className="text-slate-200 select-all">{selectedReg.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Date of Birth</span>
                    <span className="text-slate-200">
                      {new Date(selectedReg.dob).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2: Qualifications & Course */}
              <div className="glass-panel border border-slate-800/60 rounded-2xl p-5 space-y-3">
                <h4 className="text-slate-300 font-bold flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-1">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Academic Qualifications</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Education Background</span>
                    <span className="text-indigo-400 font-bold">{selectedReg.educationLevel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Selected Program</span>
                    <span className="text-slate-200">{selectedReg.course?.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Program Tuition</span>
                    <span className="text-slate-200">{formattedLKR(selectedReg.course?.fee || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900/30">
                    <span className="text-slate-500">Start Date</span>
                    <span className="text-slate-200">
                      {new Date(selectedReg.course?.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-panel border border-slate-800/60 rounded-2xl p-4 text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Permanent Address</span>
              <p className="text-slate-300 font-normal leading-relaxed">{selectedReg.address}</p>
            </div>

            {/* Notes */}
            <div className="glass-panel border border-slate-800/60 rounded-2xl p-4 text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Student Cover Notes</span>
              <p className="text-slate-300 font-normal leading-relaxed whitespace-pre-line">
                {selectedReg.additionalNotes || 'No cover notes provided.'}
              </p>
            </div>

            {/* Danger Zone Delete */}
            <div className="flex justify-between items-center p-4 bg-rose-950/10 border border-rose-900/20 rounded-2xl">
              <div className="flex flex-col text-left gap-0.5">
                <span className="font-extrabold text-rose-300">Danger Zone</span>
                <span className="text-[10px] text-slate-500">Permanently delete this registration index log.</span>
              </div>
              <button
                onClick={() => handleDeleteRegistration(selectedReg._id)}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all uppercase text-[10px] tracking-wider"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Index</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Alert */}
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
