import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import { Search, SlidersHorizontal, GraduationCap, Building2, Heart, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'All', icon: <SlidersHorizontal className="h-4 w-4" /> },
  { name: 'IT & Software', icon: <GraduationCap className="h-4 w-4" /> },
  { name: 'Civil & Construction', icon: <Building2 className="h-4 w-4" /> },
  { name: 'Health & Medicine', icon: <Heart className="h-4 w-4" /> },
  { name: 'Business & Management', icon: <Briefcase className="h-4 w-4" /> },
];

const levelOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'feeLow', label: 'Fee: Low to High' },
  { value: 'feeHigh', label: 'Fee: High to Low' },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sort, setSort] = useState('newest');
  const [feeMin, setFeeMin] = useState('');
  const [feeMax, setFeeMax] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 9;

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = [];
      params.push(`page=${page}`);
      params.push(`pageSize=${pageSize}`);
      params.push('status=Active');
      if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
      if (selectedCategory !== 'All') params.push(`category=${encodeURIComponent(selectedCategory)}`);
      if (selectedLevel !== 'All') params.push(`level=${encodeURIComponent(selectedLevel)}`);
      if (feeMin.trim()) params.push(`feeMin=${encodeURIComponent(feeMin)}`);
      if (feeMax.trim()) params.push(`feeMax=${encodeURIComponent(feeMax)}`);
      if (sort) params.push(`sort=${encodeURIComponent(sort)}`);

      const res = await api.get(`/courses?${params.join('&')}`);
      if (res.data.success) {
        setCourses(res.data.courses);
        setTotal(res.data.total);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Error fetching course catalog.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delay);
  }, [selectedCategory, selectedLevel, sort, feeMin, feeMax, search, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedLevel, sort, feeMin, feeMax, search]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-8 animate-fade-in text-left pb-16">
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 to-slate-900 border border-slate-800/80 p-8 md:p-12 overflow-hidden shadow-xl glow-indigo">
        <div className="absolute right-0 top-0 h-64 w-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            Student Course Catalog
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find your next course and book the right path.
          </h1>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed font-normal">
            Search active programs, filter by category, level, or fee, and explore full course details before requesting contact.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <div className="relative flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-lg">
            <Search className="h-5 w-5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title or organization"
              className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none">
              {levelOptions.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg">
          <div className="text-slate-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">Fee Range</div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={feeMin}
              onChange={(e) => setFeeMin(e.target.value)}
              type="number"
              placeholder="Min (LKR)"
              className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
            />
            <input
              value={feeMax}
              onChange={(e) => setFeeMax(e.target.value)}
              type="number"
              placeholder="Max (LKR)"
              className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setFeeMin('');
              setFeeMax('');
              setSelectedLevel('All');
              setSelectedCategory('All');
              setSort('newest');
              setSearch('');
            }}
            className="mt-4 w-full rounded-3xl bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-indigo-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              setSelectedCategory(cat.name);
              setPage(1);
            }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              selectedCategory === cat.name
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24">
          <Spinner size="large" />
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-900 p-12 text-center text-slate-400">
          <SlidersHorizontal className="mx-auto mb-4 h-10 w-10 text-slate-500" />
          <h3 className="text-base font-bold text-slate-200">No courses found</h3>
          <p className="text-xs text-slate-500 mt-2">Try updating your filters or check back later once more courses are available.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-slate-400">
            <span>{total} courses found</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-xs text-slate-400">Page {page} of {pages}</span>
              <button
                disabled={page >= pages}
                onClick={() => setPage((current) => Math.min(pages, current + 1))}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />}
    </div>
  );
};

export default Courses;
