import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, BookOpen, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register, authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register(name, email, password);
    if (!res.success) {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF9F6] selection:bg-orange-600 selection:text-white">
      {/* Left Side: Aesthetic Hero Image & Inspiring Content */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-stone-900 select-none">
        {/* Background Image with Subtle Parallax feel */}
        <img
          src="/auth-hero.jpg"
          alt="Workspace Inspiration"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
        />

        {/* Ambient Dark Gradient Overlays for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-stone-950/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/40" />

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-600 to-amber-500 p-0.5 shadow-lg shadow-orange-600/30">
            <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight font-sans">
              Note<span className="text-orange-500">Sphere</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Personal Workspace
            </span>
          </div>
        </div>

        {/* Center/Bottom: Hero Editorial Content */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-orange-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Join the Workspace</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
            Start shaping your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500">thoughts & ideas.</span>
          </h2>

          <p className="text-stone-300 text-sm xl:text-base leading-relaxed font-medium">
            Create an aesthetic digital home for all your ideas, project blueprints, meeting notes, and daily insights with ease.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-stone-200 text-xs font-semibold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>Full Rich-Text Editor</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-stone-200 text-xs font-semibold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Instant Tagging & Search</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span>© 2026 NoteSphere</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            Free & Secure Storage
          </span>
        </div>
      </div>

      {/* Right Side: Modern Registration Form */}
      <div className="w-full lg:w-1/2 xl:w-[48%] flex flex-col justify-center items-center p-6 sm:p-10 md:p-14 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile Brand Logo Header */}
          <div className="lg:hidden text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-600 p-0.5 shadow-md shadow-orange-600/20 mb-3">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Note<span className="text-orange-600">Sphere</span>
            </h2>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Create an account
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Start organizing your thoughts and notes today
            </p>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              {error || authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 shadow-2xs font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 shadow-2xs font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-2xl bg-white border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 shadow-2xs font-medium transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 shadow-2xs font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 text-white text-sm font-bold shadow-md shadow-orange-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Get Started for Free'}</span>
              {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-3 text-center border-t border-stone-200/80">
            <p className="text-xs text-stone-500 font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-orange-600 hover:text-orange-700 transition-colors underline underline-offset-4 ml-1 cursor-pointer"
              >
                Sign in instead
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
