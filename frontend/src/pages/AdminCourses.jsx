import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Filter, BookOpen } from 'lucide-react';

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const query = ['status=All', 'pageSize=100'];
      if (search.trim()) query.push(`search=${encodeURIComponent(search.trim())}`);
      if (categoryFilter !== 'All') query.push(`category=${encodeURIComponent(categoryFilter)}`);
      if (levelFilter !== 'All') query.push(`level=${encodeURIComponent(levelFilter)}`);
      if (statusFilter !== 'All') query.push(`status=${encodeURIComponent(statusFilter)}`);
      const res = await api.get(`/courses?${query.join('&')}`);
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Unable to fetch courses.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, categoryFilter, levelFilter, statusFilter]);

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data.success) {
        triggerToast('Course deleted successfully.', 'success');
        setCourses((prev) => prev.filter((course) => course._id !== id));
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to delete course.', 'error');
    }
  };

  const handleToggleStatus = async (course) => {
    try {
      const nextStatus = course.status === 'Active' ? 'Inactive' : 'Active';
      const res = await api.put(`/courses/${course._id}/status`, { status: nextStatus });
      if (res.data.success) {
        triggerToast(`Course marked ${nextStatus}.`, 'success');
        setCourses((prev) => prev.map((item) => (item._id === course._id ? res.data.course : item)));
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Could not update course status.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Admin Course Management</h1>
          <p className="text-xs text-slate-400 mt-1">Create, edit, and manage all courses published to the student portal.</p>
        </div>
        <button
          onClick={() => navigate('/admin/courses/add')}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      {toastMsg && <Toast type={toastType} message={toastMsg} />}

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-lg">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, organization, or instructor"
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          />
        </div>
        <div className="grid gap-3">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none">
            <option>All</option>
            <option>IT & Software</option>
            <option>Civil & Construction</option>
            <option>Health & Medicine</option>
            <option>Business & Management</option>
          </select>
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none">
            <option>All</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-24">
          <Spinner size="large" />
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-800 p-12 text-center text-slate-400">
          <BookOpen className="mx-auto h-10 w-10 text-slate-500 mb-4" />
          <h2 className="text-lg font-bold text-white">No courses found</h2>
          <p className="text-xs text-slate-500 mt-2">Try adjusting filters or add a new course to populate the catalog.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-xl">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-slate-900 text-left text-[11px] uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Level</th>
                <th className="px-5 py-4">Org</th>
                <th className="px-5 py-4">Fee</th>
                <th className="px-5 py-4">Seats</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="border-t border-slate-800 hover:bg-slate-900/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-slate-200 font-semibold">{course.title}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{course.category}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{course.level}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{course.organization}</td>
                  <td className="px-5 py-4 text-sm text-slate-200">{new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(course.fee)}</td>
                  <td className="px-5 py-4 text-sm text-slate-200">{course.availableSeats}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${course.status === 'Active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-200 space-x-2">
                    <button onClick={() => navigate(`/admin/courses/edit/${course._id}`)} className="inline-flex items-center gap-1 rounded-2xl bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700">
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button onClick={() => handleDeleteCourse(course._id)} className="inline-flex items-center gap-1 rounded-2xl bg-rose-600 px-3 py-2 text-xs text-white hover:bg-rose-500">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                    <button onClick={() => handleToggleStatus(course)} className="inline-flex items-center gap-1 rounded-2xl bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-500">
                      {course.status === 'Active' ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />} {course.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
