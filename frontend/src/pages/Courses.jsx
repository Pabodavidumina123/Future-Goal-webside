import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import { Search, SlidersHorizontal, BookOpen, GraduationCap, Building2, Heart, Briefcase } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const categories = [
    { name: 'All', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'IT & Software', icon: <GraduationCap className="h-4 w-4" /> },
    { name: 'Civil & Construction', icon: <Building2 className="h-4 w-4" /> },
    { name: 'Health & Medicine', icon: <Heart className="h-4 w-4" /> },
    { name: 'Business & Management', icon: <Briefcase className="h-4 w-4" /> }
  ];

  // Fetch courses on mount, category shift, or search query
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const queryParams = [];
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (search) {
          queryParams.push(`search=${encodeURIComponent(search)}`);
        }

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const res = await api.get(`/courses${queryString}`);
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        setToastMsg(err.response?.data?.message || 'Error fetching course catalog.');
        setToastType('error');
      } finally {
        setLoading(false);
      }
    };

    // Add a debouncing handler for text inputs if wanted, but manual or direct triggers are also perfectly reliable
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, search]);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Visual Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 to-slate-900 border border-slate-800/80 p-8 md:p-12 overflow-hidden shadow-xl glow-indigo">
        {/* Glowing backdrop circle */}
        <div className="absolute right-0 top-0 h-64 w-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            Education Opportunities
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Shape Your Future <br />
            After Advanced Levels
          </h1>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed font-normal">
            Explore industry-accredited courses designed for Sri Lankan students seeking software engineering, quantity surveying, medicine, and business careers.
          </p>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course title, tech stack..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border glass-input text-sm shadow-md"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/15'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Courses Dynamic Results Grid */}
      {loading ? (
        <div className="py-24">
          <Spinner size="large" />
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-900 space-y-4 max-w-md mx-auto">
          <SlidersHorizontal className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Courses Found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any courses matching your search query or selected category. Let's try adjusting the filters!
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default Courses;
