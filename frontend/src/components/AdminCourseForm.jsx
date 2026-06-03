import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from './Common/Spinner';
import Toast from './Common/Toast';
import { UploadCloud, ArrowLeft, CheckCircle2 } from 'lucide-react';

const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];
const statusOptions = ['Active', 'Inactive'];
const categoryOptions = ['All', 'IT & Software', 'Civil & Construction', 'Health & Medicine', 'Business & Management'];

const CourseForm = ({ course, mode = 'add', onSuccess }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: '',
    category: 'IT & Software',
    description: '',
    duration: '',
    fee: '',
    level: 'Beginner',
    imageUrl: '',
    organization: '',
    contactNumber: '',
    email: '',
    website: '',
    startDate: '',
    endDate: '',
    schedule: '',
    location: '',
    totalSeats: '',
    availableSeats: '',
    requirementsText: '',
    learningOutcomesText: '',
    status: 'Active',
    instructorName: '',
    instructorRole: '',
    instructorEmail: '',
    instructorPhone: '',
    instructorBio: '',
    instructorImageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (course) {
      setFormValues({
        title: course.title || '',
        category: course.category || 'IT & Software',
        description: course.description || '',
        duration: course.duration || '',
        fee: course.fee || '',
        level: course.level || 'Beginner',
        imageUrl: course.image || '',
        organization: course.organization || '',
        contactNumber: course.contactNumber || '',
        email: course.email || '',
        website: course.website || '',
        startDate: course.startDate ? new Date(course.startDate).toISOString().slice(0, 10) : '',
        endDate: course.endDate ? new Date(course.endDate).toISOString().slice(0, 10) : '',
        schedule: course.schedule || '',
        location: course.location || '',
        totalSeats: course.totalSeats || '',
        availableSeats: course.availableSeats || '',
        requirementsText: (course.requirements || []).join(', '),
        learningOutcomesText: (course.learningOutcomes || []).join(', '),
        status: course.status || 'Active',
        instructorName: course.instructor?.name || '',
        instructorRole: course.instructor?.role || '',
        instructorEmail: course.instructor?.email || '',
        instructorPhone: course.instructor?.phone || '',
        instructorBio: course.instructor?.bio || '',
        instructorImageUrl: course.instructor?.image || '',
      });
    }
  }, [course]);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormValues((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      triggerToast('Choose an image file before upload.', 'error');
      return null;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setLoading(true);
      const res = await api.post('/courses/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        triggerToast('Image uploaded successfully.', 'success');
        setFormValues((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
        return res.data.imageUrl;
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setLoading(false);
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.imageUrl && imageFile) {
      const uploaded = await uploadImage();
      if (!uploaded) return;
    }

    if (!formValues.imageUrl) {
      triggerToast('Please provide a course image URL or upload a file.', 'error');
      return;
    }

    if (Number(formValues.availableSeats) > Number(formValues.totalSeats)) {
      triggerToast('Available seats cannot exceed total seats.', 'error');
      return;
    }

    const payload = {
      title: formValues.title,
      category: formValues.category,
      description: formValues.description,
      duration: formValues.duration,
      fee: Number(formValues.fee),
      level: formValues.level,
      image: formValues.imageUrl,
      organization: formValues.organization,
      contactNumber: formValues.contactNumber,
      email: formValues.email,
      website: formValues.website,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      schedule: formValues.schedule,
      location: formValues.location,
      totalSeats: Number(formValues.totalSeats),
      availableSeats: Number(formValues.availableSeats),
      requirements: formValues.requirementsText.split(',').map((item) => item.trim()).filter(Boolean),
      learningOutcomes: formValues.learningOutcomesText.split(',').map((item) => item.trim()).filter(Boolean),
      status: formValues.status,
      instructorName: formValues.instructorName,
      instructorRole: formValues.instructorRole,
      instructorEmail: formValues.instructorEmail,
      instructorPhone: formValues.instructorPhone,
      instructorBio: formValues.instructorBio,
      instructorImage: formValues.instructorImageUrl,
    };

    try {
      setLoading(true);
      let res;
      if (mode === 'edit' && course?._id) {
        res = await api.put(`/courses/${course._id}`, payload);
      } else {
        res = await api.post('/courses', payload);
      }
      if (res.data.success) {
        triggerToast(`Course ${mode === 'edit' ? 'updated' : 'created'} successfully.`, 'success');
        onSuccess(res.data.course);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Unable to save course.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:bg-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-right">
          <p className="text-xs text-slate-500">Required fields are marked with *</p>
          <span className="text-sm font-bold text-slate-100">{mode === 'edit' ? 'Edit existing course' : 'Add new course'}</span>
        </div>
      </div>

      {toastMsg && <Toast type={toastType} message={toastMsg} />}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Course Title *</span>
              <input value={formValues.title} onChange={handleChange('title')} placeholder="E.g. BSc in Software Engineering" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Category *</span>
              <select value={formValues.category} onChange={handleChange('category')} className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500">
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Course Description *</span>
            <textarea value={formValues.description} onChange={handleChange('description')} rows={4} className="mt-2 block w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-200 outline-none focus:border-indigo-500" placeholder="Write a short overview of the course" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Duration *</span>
              <input value={formValues.duration} onChange={handleChange('duration')} placeholder="E.g. 4 Years" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Fee (LKR) *</span>
              <input type="number" value={formValues.fee} onChange={handleChange('fee')} placeholder="E.g. 850000" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Level *</span>
              <select value={formValues.level} onChange={handleChange('level')} className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500">
                {levelOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Status *</span>
              <select value={formValues.status} onChange={handleChange('status')} className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500">
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Start Date *</span>
              <input type="date" value={formValues.startDate} onChange={handleChange('startDate')} className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">End Date *</span>
              <input type="date" value={formValues.endDate} onChange={handleChange('endDate')} className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Schedule *</span>
            <input value={formValues.schedule} onChange={handleChange('schedule')} placeholder="E.g. Mon/Wed/Fri 8:30 AM - 12:30 PM" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Location *</span>
            <input value={formValues.location} onChange={handleChange('location')} placeholder="E.g. Colombo Campus" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Organization / Institute Name *</span>
            <input value={formValues.organization} onChange={handleChange('organization')} placeholder="E.g. Future Path Institute" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Website URL *</span>
            <input value={formValues.website} onChange={handleChange('website')} placeholder="https://" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Contact Number *</span>
              <input value={formValues.contactNumber} onChange={handleChange('contactNumber')} placeholder="E.g. +94 77 123 4567" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Email Address *</span>
              <input value={formValues.email} onChange={handleChange('email')} placeholder="admissions@example.com" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Total Seats *</span>
              <input type="number" min="1" value={formValues.totalSeats} onChange={handleChange('totalSeats')} placeholder="E.g. 50" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" required />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Available Seats *</span>
              <input type="number" min="0" value={formValues.availableSeats} onChange={handleChange('availableSeats')} placeholder="E.g. 30" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" required />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Instructor Role *</span>
              <input value={formValues.instructorRole} onChange={handleChange('instructorRole')} placeholder="E.g. Head of Department" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" required />
            </label>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Instructor Name *</span>
            <input value={formValues.instructorName} onChange={handleChange('instructorName')} placeholder="E.g. Prof. Janaka Perera" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Instructor Email *</span>
            <input value={formValues.instructorEmail} onChange={handleChange('instructorEmail')} placeholder="prof.janaka@example.com" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Instructor Phone *</span>
            <input value={formValues.instructorPhone} onChange={handleChange('instructorPhone')} placeholder="E.g. +94 77 987 6543" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Instructor Bio *</span>
            <textarea value={formValues.instructorBio} onChange={handleChange('instructorBio')} rows={3} className="mt-2 block w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-200 outline-none focus:border-indigo-500" placeholder="Short instructor introduction" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Instructor Image URL *</span>
            <input value={formValues.instructorImageUrl} onChange={handleChange('instructorImageUrl')} placeholder="https://" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Course Image URL *</span>
            <input value={formValues.imageUrl} onChange={handleChange('imageUrl')} placeholder="https://" className="mt-2 block w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Upload Course Image</span>
            <div className="mt-2 flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleFileSelect} className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
              <button type="button" onClick={uploadImage} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
                <UploadCloud className="h-4 w-4" /> Upload
              </button>
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Requirements *</span>
              <textarea value={formValues.requirementsText} onChange={handleChange('requirementsText')} rows={3} placeholder="Separate with commas" className="mt-2 block w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Learning Outcomes *</span>
              <textarea value={formValues.learningOutcomesText} onChange={handleChange('learningOutcomesText')} rows={3} placeholder="Separate with commas" className="mt-2 block w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">
            <h2 className="text-lg font-bold text-slate-100">Preview & Controls</h2>
            <p className="text-sm text-slate-500 mt-2">Use this summary panel to confirm your course content before saving.</p>

            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="grid gap-3">
                <div className="flex justify-between items-center rounded-2xl bg-slate-900/60 px-4 py-3">
                  <span>Course name</span>
                  <strong>{formValues.title || 'Untitled course'}</strong>
                </div>
                <div className="flex justify-between items-center rounded-2xl bg-slate-900/60 px-4 py-3">
                  <span>Category</span>
                  <strong>{formValues.category}</strong>
                </div>
                <div className="flex justify-between items-center rounded-2xl bg-slate-900/60 px-4 py-3">
                  <span>Seats (Available / Total)</span>
                  <strong>{(formValues.availableSeats || '0') + ' / ' + (formValues.totalSeats || '0')}</strong>
                </div>
                <div className="flex justify-between items-center rounded-2xl bg-slate-900/60 px-4 py-3">
                  <span>Status</span>
                  <strong>{formValues.status}</strong>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <Spinner size="sm" /> : <><CheckCircle2 className="h-4 w-4" /> Save Course</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
