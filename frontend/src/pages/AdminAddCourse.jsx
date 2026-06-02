import React from 'react';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../components/AdminCourseForm';

const AdminAddCourse = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Add New Course</h1>
        <p className="text-xs text-slate-400">Fill in all required fields and publish a new course to the student portal.</p>
      </div>
      <CourseForm mode="add" onSuccess={handleSuccess} />
    </div>
  );
};

export default AdminAddCourse;
