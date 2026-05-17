import React, { useState } from 'react';
import { MapPin, Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, MapIcon, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const WARDS = [
  'Anna Nagar', 'T. Nagar', 'Adyar', 'Tambaram', 'Chromepet',
  'Velachery', 'Porur', 'Ambattur', 'Avadi', 'Sholinganallur',
  'Perungudi', 'Kodambakkam', 'Mylapore', 'Triplicane', 'Royapuram',
  'Tondiarpet', 'Perambur', 'Villivakkam', 'Other Area',
];

interface PasswordStrength {
  score: number;  // 0-4
  label: string;
  color: string;
}

function getStrength(pwd: string): PasswordStrength {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981'];
  return { score, label: labels[score], color: colors[score] };
}

const SignupPage: React.FC = () => {
  const { signup, setPage } = useAuth();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', area: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(form.password);
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!form.email) { setError('Email is required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const err = signup(form.name, form.email, form.password, form.phone || undefined, form.area || undefined);
    if (err) { setError(err); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  const bg = isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';
  const card = isDark ? 'bg-gray-900 border border-gray-800 shadow-2xl' : 'bg-white border border-gray-100 shadow-2xl';
  const inp = isDark
    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500';
  const lbl = isDark ? 'text-gray-300' : 'text-gray-700';
  const sub = isDark ? 'text-gray-500' : 'text-gray-500';

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${bg}`}>
        <div className={`rounded-2xl p-10 text-center max-w-sm w-full ${card}`}>
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account Created!</h2>
          <p className={`text-sm mb-6 ${sub}`}>Welcome to GeoReport, {form.name.split(' ')[0]}! You're now logged in.</p>
          <button
            id="goto-home-after-signup"
            onClick={() => setPage('home')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl text-sm hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Start Reporting Issues →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-10 ${bg}`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create your account
          </h1>
          <p className={`text-sm mt-1 ${sub}`}>Join GeoReport and make your area better</p>
        </div>

        <div className={`rounded-2xl p-8 ${card}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>Full Name *</label>
              <div className="relative">
                <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input id="signup-name" type="text" placeholder="Ravi Kumar" value={form.name} onChange={set('name')}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${inp}`} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>Email Address *</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input id="signup-email" type="email" placeholder="ravi@example.com" value={form.email} onChange={set('email')}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${inp}`} />
              </div>
            </div>

            {/* Phone + Area row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>Phone</label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input id="signup-phone" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={set('phone')}
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm outline-none transition-all ${inp}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>Your Area</label>
                <div className="relative">
                  <MapIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'} z-10`} />
                  <select id="signup-area" value={form.area} onChange={set('area')}
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm outline-none transition-all appearance-none ${inp}`}>
                    <option value="">Select…</option>
                    {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>Password *</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input id="signup-password" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={set('password')}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm outline-none transition-all ${inp}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0,1,2,3].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{
                        backgroundColor: i < strength.score ? strength.color : isDark ? '#374151' : '#e5e7eb'
                      }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${lbl}`}>Confirm Password *</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input id="signup-confirm-password" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirmPassword} onChange={set('confirmPassword')}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                    form.confirmPassword.length > 0
                      ? passwordsMatch
                        ? inp + ' border-emerald-500'
                        : inp + ' border-red-500'
                      : inp
                  }`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword.length > 0 && (
                <p className={`text-xs mt-1 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button id="signup-submit" type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-lg mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account…
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className={`mt-6 pt-5 border-t text-center ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            <p className={`text-sm ${sub}`}>
              Already have an account?{' '}
              <button id="go-to-login" onClick={() => setPage('login')}
                className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
                Sign in
              </button>
            </p>
          </div>
        </div>

        <p className="text-center mt-5">
          <button id="back-home-signup" onClick={() => setPage('home')}
            className={`text-xs font-medium ${sub} hover:text-indigo-500 transition-colors`}>
            ← Back to map
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
