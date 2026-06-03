import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import StudentDashboard from './pages/StudentDashboard';
import CourseDashboard from './pages/CourseDashboard';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminAddCourse from './pages/AdminAddCourse';
import AdminEditCourse from './pages/AdminEditCourse';
import AdminContactRequests from './pages/AdminContactRequests';
import Notifications from './pages/Notifications';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Spinner from './components/Common/Spinner';

// 1. Protected Router Wrapper (Students & Admins)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// 2. Admin Only Guard Route
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/courses" replace />;
  return children;
};

// 3. Public-Only Routes (Redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen />;

  if (user && location.pathname !== '/register') {
    return user.role === 'admin' ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/courses" replace />
    );
  }

  return children;
};

// 4. Layout Wrapper for Authenticated Pages
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-8 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Signin/Signup */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Student Protected Portal */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Courses />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CourseDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <StudentDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/courses"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CourseDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MyCourses />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Notifications />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <AdminRoute>
                <AppLayout>
                  <AdminCourses />
                </AppLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/courses/add"
            element={
              <AdminRoute>
                <AppLayout>
                  <AdminAddCourse />
                </AppLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/courses/edit/:id"
            element={
              <AdminRoute>
                <AppLayout>
                  <AdminEditCourse />
                </AppLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/contacts"
            element={
              <AdminRoute>
                <AppLayout>
                  <AdminContactRequests />
                </AppLayout>
              </AdminRoute>
            }
          />

          {/* Redirects */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  localStorage.getItem('token')
                    ? '/courses'
                    : '/login'
                }
                replace
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
