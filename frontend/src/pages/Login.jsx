import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import Toast from '../components/Common/Toast';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email || !password) {
      triggerToast('Please fill in all fields.', 'error');
      return;
    }

    setLoading(false);
    try {
      const res = await login(email, password);
      if (res.success) {
        triggerToast('Welcome back to Future Path!', 'success');
        if (res.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/courses');
        }
      } else {
        triggerToast(res.message, 'error');
      }
    } catch (err) {
      triggerToast('An unexpected error occurred.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Accents */}
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
            Begin Your Career Path
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Log in to discover courses curated for Sri Lankan A/L scholars.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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
                  placeholder="name@gmail.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              <span>{loading ? 'Entering System...' : 'Sign In Now'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Direct To Signup */}
          <div className="text-center text-xs text-slate-500 mt-6 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors">
              Create student account
            </Link>
          </div>
        </div>

        {/* Demo Credentials Info Box */}
        <div className="rounded-2xl bg-indigo-950/20 border border-indigo-900/30 p-4 text-left text-xs text-slate-400 space-y-1">
          <p className="font-extrabold text-indigo-300">🔑 Testing Administrative Account:</p>
          <div className="grid grid-cols-2 gap-x-2 py-1 font-semibold text-[11px]">
            <div>Email: <code className="text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded select-all">malinda@gmail.com</code></div>
            <div>Password: <code className="text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded select-all">malinda@12345</code></div>
          </div>
          <p className="text-[10px] text-slate-500">
            * Or type any credentials in registration to sign up as a regular student scholar!
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default Login;
