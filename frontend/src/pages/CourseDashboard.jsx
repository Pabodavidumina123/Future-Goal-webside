import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Common/Spinner';
import coursesApi from '../services/coursesApi';

const categories = ['All', 'IT & Software', 'Civil & Construction', 'Health & Medicine', 'Business & Management'];
const durationOptions = ['All', '1 Year', '1.5 Years', '2 Years', '3 Years', '4 Years'];

const CourseDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [duration, setDuration] = useState('All');
  const [feeMin, setFeeMin] = useState('');
  const [feeMax, setFeeMax] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: 1,
        pageSize: 100,
        status: 'Active',
      };
      if (search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;
      if (duration && duration !== 'All') params.level = duration;
      if (feeMin) params.feeMin = feeMin;
      if (feeMax) params.feeMax = feeMax;

      const data = await coursesApi.getCourses(params);
      if (data && data.courses) {
        setCourses(data.courses);
      } else if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      loadCourses();
    }, 200);
    return () => clearTimeout(t);
  }, [search, category, duration, feeMin, feeMax]);

  return (
    <div className="space-y-8 animate-fade-in text-left pb-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Course Catalog</h1>
          <p className="text-sm text-slate-400">Browse available programs and check details.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <div className="relative flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 p-3 shadow-lg">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title"
              className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none">
              {durationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input value={feeMin} onChange={(e) => setFeeMin(e.target.value)} placeholder="Min fee" type="number" className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none" />
            <input value={feeMax} onChange={(e) => setFeeMax(e.target.value)} placeholder="Max fee" type="number" className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-lg">
          <div className="text-slate-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">Filters</div>
          <div className="text-sm text-slate-300">Use search and filters to narrow results.</div>
        </div>
      </div>

      {loading ? (
        <div className="py-24"><Spinner size="large" /></div>
      ) : error ? (
        <div className="glass-panel rounded-3xl border border-slate-900 p-8 text-center text-rose-400">
          <h3 className="text-base font-bold">Error</h3>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-900 p-12 text-center text-slate-400">
          <h3 className="text-base font-bold text-slate-200">No courses found</h3>
          <p className="text-xs text-slate-500 mt-2">Try adjusting filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDashboard;
