import React, { useState } from 'react';
import { MapPin, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { login, setPage } = useAuth();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 600)); // simulate async
    const err = login(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  const bg = isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';
  const card = isDark
    ? 'bg-gray-900 border border-gray-800 shadow-2xl'
    : 'bg-white border border-gray-100 shadow-2xl';
  const inp = isDark
    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20';
  const lbl = isDark ? 'text-gray-300' : 'text-gray-700';
  const sub = isDark ? 'text-gray-500' : 'text-gray-500';
  const divider = isDark ? 'border-gray-800' : 'border-gray-100';

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${bg}`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back
          </h1>
          <p className={`text-sm mt-1 ${sub}`}>Sign in to your GeoReport account</p>
        </div>

        <div className={`rounded-2xl p-8 ${card}`}>
          {/* Demo hint */}
          <div className={`mb-5 p-3 rounded-xl text-xs flex gap-2 items-start ${
            isDark ? 'bg-indigo-950/60 border border-indigo-800 text-indigo-300'
                   : 'bg-indigo-50 border border-indigo-100 text-indigo-700'
          }`}>
            <span className="mt-0.5">💡</span>
            <span>New user? <button className="font-semibold underline" onClick={() => setPage('signup')}>Create a free account</button> first.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all ring-2 ring-transparent ${inp}`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm outline-none transition-all ring-2 ring-transparent ${inp}`}
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className={`mt-6 pt-5 border-t text-center ${divider}`}>
            <p className={`text-sm ${sub}`}>
              Don't have an account?{' '}
              <button
                id="go-to-signup"
                onClick={() => setPage('signup')}
                className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>

        {/* Back home */}
        <p className="text-center mt-5">
          <button
            id="back-to-home"
            onClick={() => setPage('home')}
            className={`text-xs font-medium ${sub} hover:text-indigo-500 transition-colors`}
          >
            ← Back to map
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
