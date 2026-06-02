import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import CourseForm from '../components/AdminCourseForm';

const AdminEditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.course);
        }
      } catch (err) {
        triggerToast(err.response?.data?.message || 'Unable to load course.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSuccess = () => {
    navigate('/admin/courses');
  };

  if (loading) {
    return (
      <div className="py-24">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Edit Course</h1>
        <p className="text-xs text-slate-400">Update course information and save the latest catalog details.</p>
      </div>
      {toastMsg && <Toast type={toastType} message={toastMsg} />}
      {course ? <CourseForm mode="edit" course={course} onSuccess={handleSuccess} /> : null}
    </div>
  );
};

export default AdminEditCourse;
