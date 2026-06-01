import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import Modal from '../components/Common/Modal';
import CourseCard from '../components/CourseCard';
import confetti from 'canvas-confetti';
import { Calendar, Clock, DollarSign, Users, Award, BookOpen, User as UserIcon, CheckCircle2, ChevronLeft, ArrowRight, Phone, MapPin, GraduationCap } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Toast Notification state
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Registration Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.course);
          
          // Fetch related courses in same category
          const relatedRes = await api.get(`/courses?category=${encodeURIComponent(res.data.course.category)}`);
          if (relatedRes.data.success) {
            const filtered = relatedRes.data.courses.filter((c) => c._id !== id).slice(0, 3);
            setRelatedCourses(filtered);
          }
        }
      } catch (err) {
        triggerToast(err.response?.data?.message || 'Error fetching course details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  // Sync user info to form if user shifts
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !address || !dob || !educationLevel) {
      triggerToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await api.post('/registrations', {
        courseId: id,
        fullName,
        email,
        phone,
        address,
        dob,
        educationLevel,
        additionalNotes,
      });

      if (res.data.success) {
        // Trigger Canvas Confetti celebration!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        triggerToast(res.data.message || 'Registration submitted successfully!', 'success');
        setIsModalOpen(false);

        // Reset form variables not locked to user profile
        setPhone('');
        setAddress('');
        setDob('');
        setEducationLevel('');
        setAdditionalNotes('');
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32">
        <Spinner size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-300">Course Not Found</h2>
        <Link to="/courses" className="text-indigo-400 font-bold hover:underline">
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  // Format fee in LKR
  const formattedFee = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(course.fee);

  const formattedDate = new Date(course.startDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-10 text-left animate-fade-in pb-16">
      {/* Back Button */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Return to Courses</span>
      </Link>

      {/* Main Grid Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Banner Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visual */}
          <div className="relative h-64 md:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-900 bg-slate-950">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            <span className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-600/90 text-slate-100 backdrop-blur-sm shadow-md">
              {course.category}
            </span>
          </div>

          {/* Heading details */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
              {course.description}
            </p>
          </div>

          <hr className="border-slate-800" />

          {/* Learning Outcomes Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-400" />
              <span>What You Will Learn</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.learningOutcomes?.map((outcome, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-slate-300 font-medium">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Requirements & Syllabus Prerequisites */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <span>Course Requirements</span>
            </h3>
            <ul className="space-y-2.5 pl-1">
              {course.requirements?.map((req, idx) => (
                <li key={idx} className="flex gap-3 items-center text-xs md:text-sm text-slate-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action / Cost Column */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="glass-panel border border-slate-900 rounded-3xl p-6 shadow-xl space-y-6 glow-indigo">
            <div className="space-y-4">
              {/* Cost Badge */}
              <div className="text-center py-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Course Investment</span>
                <div className="text-2xl md:text-3xl font-extrabold text-indigo-400 tracking-tight mt-1">{formattedFee}</div>
              </div>

              {/* Attributes list */}
              <div className="space-y-4 text-xs font-semibold text-slate-300">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Duration</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-indigo-400" />{course.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Start Date</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-emerald-400" />{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Available Slots</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-indigo-400" />{course.availableSeats} Seats left</span>
                </div>
              </div>
            </div>

            {/* Action Register Button */}
            {user?.role === 'admin' ? (
              <div className="text-center py-3 bg-indigo-950/20 rounded-xl border border-indigo-900/30 text-xs font-bold text-indigo-300">
                Logged in as Admin Overview
              </div>
            ) : course.availableSeats <= 0 ? (
              <button
                disabled
                className="w-full py-4 bg-rose-950/50 border border-rose-900/30 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-rose-300 cursor-not-allowed text-center"
              >
                Registration Closed (Full)
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/25 active:scale-95 transition-all"
              >
                <span>Register Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Instructor Box */}
          <div className="glass-panel border border-slate-900 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Instructor Dossier</h4>
            <div className="flex items-center gap-4">
              <img
                src={course.instructor?.image}
                alt={course.instructor?.name}
                className="h-12 w-12 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-100">{course.instructor?.name}</span>
                <span className="text-[10px] text-indigo-400 font-semibold">{course.instructor?.role}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-1 font-light">
              {course.instructor?.bio}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-slate-900 my-10" />

      {/* Related recommendations */}
      {relatedCourses.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-100">Related Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCourses.map((rc) => (
              <CourseCard key={rc._id} course={rc} />
            ))}
          </div>
        </div>
      )}

      {/* Registration Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Register: ${course.title}`}>
        <form onSubmit={handleRegisterSubmit} className="space-y-5 text-left">
          {/* Header */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-indigo-400 shrink-0" />
            <div className="flex flex-col text-xs text-slate-400">
              <span className="font-bold text-slate-200 uppercase tracking-wide">Scholar Application</span>
              <span>Complete this form to submit your dossier to the school registrar.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sunil Perera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border glass-input text-xs"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border bg-slate-950/60 border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0771234567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border glass-input text-xs"
                  required
                />
              </div>
            </div>

            {/* DOB */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border glass-input text-xs"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Permanent Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Write your home address details..."
                rows="2"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border glass-input text-xs resize-none"
                required
              />
            </div>
          </div>

          {/* Education Level (GCE A/L Stream details) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              G.C.E. A/L Stream & Year Completed <span className="text-rose-500">*</span>
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border glass-input text-xs font-semibold appearance-none"
              required
            >
              <option value="" disabled>Select your stream</option>
              <option value="Physical Science (Combined Maths)">Combined Mathematics Stream</option>
              <option value="Biological Science (Biology)">Biological Science Stream</option>
              <option value="Commerce Stream">Commerce Stream</option>
              <option value="Technology Stream (Engineering / Biosystems)">Technology Stream</option>
              <option value="Arts Stream">Arts Stream</option>
              <option value="Other Foundation Degree / Edexcel">Other Foundation / London A/Ls</option>
            </select>
          </div>

          {/* Additional notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Additional Notes (Optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Provide results details or special needs requirements..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border glass-input text-xs resize-none"
            />
          </div>

          {/* Submit registration */}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/10 disabled:opacity-50 mt-4 active:scale-95 transition-all"
          >
            {submitLoading ? 'Submitting Application...' : 'Submit Admission Request'}
          </button>
        </form>
      </Modal>

      {/* Toast */}
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default CourseDetails;
