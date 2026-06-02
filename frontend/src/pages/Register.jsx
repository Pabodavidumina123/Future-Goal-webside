import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowRight } from 'lucide-react';
import Toast from '../components/Common/Toast';

const Register = () => {
  const { register, user, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      triggerToast('Please fill in all fields.', 'error');
      return;
    }

    if (password.length < 6) {
      triggerToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      triggerToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.success) {
        triggerToast('Registration successful! Welcome.', 'success');
        navigate('/courses');
      } else {
        triggerToast(res.message, 'error');
      }
    } catch (err) {
      triggerToast('An error occurred during registration.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-950">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl glow-indigo" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl glow-emerald" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 items-center justify-center font-black text-2xl text-white shadow-xl shadow-indigo-500/10">
            FP
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-100 to-slate-200 bg-clip-text text-transparent">
            Create Student Account
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Register to start applying for prestigious local and global career degrees.
          </p>
        </div>

        {user ? (
          <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800/80 text-center">
            <h2 className="text-xl font-bold text-white">Already signed in</h2>
            <p className="text-sm text-slate-400 mt-3">
              You are currently logged in as <span className="font-semibold text-slate-100">{user.name}</span>. To create a new student account, please log out first.
            </p>
            <button
              onClick={logout}
              className="mt-6 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition-colors"
            >
              Log out and register
            </button>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sunil Perera"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sunil@gmail.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border glass-input text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Register Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              <span>{loading ? 'Creating Profile...' : 'Register Scholar'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Login redirection */}
          <div className="text-center text-xs text-slate-500 mt-6 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default Register;
