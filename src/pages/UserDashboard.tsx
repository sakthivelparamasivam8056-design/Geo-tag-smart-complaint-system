import React, { useMemo } from 'react';
import {
  MapPin, FileText, CheckCircle, Clock, XCircle, AlertTriangle,
  TrendingUp, ThumbsUp, User, Calendar, Phone, MapIcon, Edit3,
  ChevronRight, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';
import { CATEGORY_ICONS, STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';

// ─── Helper ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string; value: number; icon: React.ReactNode;
  accent: string; isDark: boolean; sub?: string;
}> = ({ label, value, icon, accent, isDark, sub }) => (
  <div className={`rounded-2xl p-5 flex items-start gap-4 ${
    isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100 shadow-sm'
  }`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: accent + '20' }}>
      <span style={{ color: accent }}>{icon}</span>
    </div>
    <div>
      <p className={`text-2xl font-extrabold leading-none mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      {sub && <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{sub}</p>}
    </div>
  </div>
);

// ─── Complaint row ────────────────────────────────────────────────────────────
const ComplaintRow: React.FC<{ c: Complaint; isDark: boolean; onClick: () => void }> = ({ c, isDark, onClick }) => {
  const statusColor = STATUS_COLORS[c.status];
  const priorityColor = PRIORITY_COLORS[c.priority];

  return (
    <button onClick={onClick} className={`w-full text-left p-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] border ${
      isDark ? 'bg-gray-900/80 border-gray-800 hover:border-indigo-700/50 hover:bg-gray-800/80' : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-xl mt-0.5 flex-shrink-0">{CATEGORY_ICONS[c.category]}</span>
          <div className="min-w-0">
            <p className={`text-sm font-semibold truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{c.title}</p>
            <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              📍 {c.address || `${c.coordinates.lat.toFixed(4)}, ${c.coordinates.lng.toFixed(4)}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
            backgroundColor: statusColor + '20', color: statusColor
          }}>{c.status}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
            backgroundColor: priorityColor + '15', color: priorityColor
          }}>{c.priority}</span>
        </div>
      </div>
      <div className={`flex items-center gap-3 mt-2.5 text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(c.timestamp)}</span>
        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{c.upvotes}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.category}</span>
        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
      </div>
    </button>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const UserDashboard: React.FC = () => {
  const { user, logout, setPage } = useAuth();
  const { complaints, selectComplaint, setView, theme, toggleForm, isLoading } = useApp();
  const isDark = theme === 'dark';

  // Filter to this user's complaints
  const myComplaints = useMemo(
    () => complaints.filter((c) => c.userId === user?.id || c.userName === 'You'),
    [complaints, user]
  );

  const stats = useMemo(() => ({
    total: myComplaints.length,
    pending: myComplaints.filter((c) => c.status === 'Pending').length,
    inProgress: myComplaints.filter((c) => c.status === 'In Progress').length,
    resolved: myComplaints.filter((c) => c.status === 'Resolved').length,
    rejected: myComplaints.filter((c) => c.status === 'Rejected').length,
    totalUpvotes: myComplaints.reduce((s, c) => s + c.upvotes, 0),
  }), [myComplaints]);

  const recent = useMemo(
    () => [...myComplaints].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5),
    [myComplaints]
  );

  // Avatar initials
  const initials = user?.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'GR';

  const bg = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const heading = isDark ? 'text-white' : 'text-gray-900';
  const sub = isDark ? 'text-gray-400' : 'text-gray-600';
  const card = isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100 shadow-sm';

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 px-4 sm:px-8 pt-8 pb-20 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl" />
        </div>
        <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-xl font-extrabold text-white border border-white/30 shadow-lg">
              {initials}
            </div>
            <div>
              <p className="text-indigo-200 text-sm font-medium">Welcome back 👋</p>
              <h2 className="text-2xl font-extrabold text-white">{user?.name || 'Guest'}</h2>
              {user?.area && (
                <p className="text-indigo-200 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {user.area}
                </p>
              )}
            </div>
          </div>
          <button
            id="dashboard-logout"
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all backdrop-blur"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-14 pb-12 relative z-10">

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Reported" value={stats.total} icon={<FileText className="w-5 h-5" />} accent="#6366f1" isDark={isDark} />
          <StatCard label="Pending" value={stats.pending} icon={<Clock className="w-5 h-5" />} accent="#f59e0b" isDark={isDark} sub="Awaiting action" />
          <StatCard label="In Progress" value={stats.inProgress} icon={<Loader2 className="w-5 h-5" />} accent="#3b82f6" isDark={isDark} />
          <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle className="w-5 h-5" />} accent="#10b981" isDark={isDark} />
          <StatCard label="Rejected" value={stats.rejected} icon={<XCircle className="w-5 h-5" />} accent="#ef4444" isDark={isDark} />
          <StatCard label="Total Upvotes" value={stats.totalUpvotes} icon={<ThumbsUp className="w-5 h-5" />} accent="#8b5cf6" isDark={isDark} sub="Community support" />
        </div>

        {/* Resolution progress bar */}
        {stats.total > 0 && (
          <div className={`rounded-2xl p-5 mb-6 ${card}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-bold flex items-center gap-2 ${heading}`}>
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Resolution Rate
              </p>
              <span className="text-lg font-extrabold text-emerald-400">
                {Math.round((stats.resolved / stats.total) * 100)}%
              </span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${(stats.resolved / stats.total) * 100}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${sub}`}>{stats.resolved} resolved of {stats.total}</span>
              <span className={`text-xs ${sub}`}>{stats.pending} still pending</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* My recent complaints */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-bold ${heading}`}>My Complaints</h3>
              <button
                id="dashboard-new-complaint"
                onClick={() => { setPage('home'); setTimeout(() => toggleForm(), 100); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                + New Report
              </button>
            </div>

            {isLoading ? (
              <div className={`rounded-2xl p-10 text-center ${card}`}>
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                <p className={`text-sm ${sub}`}>Loading complaints…</p>
              </div>
            ) : recent.length === 0 ? (
              <div className={`rounded-2xl p-10 text-center ${card}`}>
                <AlertTriangle className="w-8 h-8 mx-auto text-amber-400 mb-3" />
                <p className={`text-sm font-semibold ${heading}`}>No complaints yet</p>
                <p className={`text-xs mt-1 ${sub}`}>Tap the button below to report your first issue.</p>
                <button
                  id="dashboard-first-report"
                  onClick={() => { setPage('home'); setTimeout(() => toggleForm(), 100); }}
                  className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Report an Issue
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recent.map((c) => (
                  <ComplaintRow
                    key={c.id}
                    c={c}
                    isDark={isDark}
                    onClick={() => { selectComplaint(c); setView('map'); setPage('home'); }}
                  />
                ))}
                {myComplaints.length > 5 && (
                  <button
                    id="dashboard-view-all"
                    onClick={() => { setView('list'); setPage('home'); }}
                    className={`w-full py-3 rounded-xl text-xs font-semibold border transition-all ${
                      isDark ? 'border-gray-800 text-gray-400 hover:border-indigo-700 hover:text-indigo-400'
                             : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    View all {myComplaints.length} complaints →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Profile card */}
          <div className="space-y-4">
            <h3 className={`text-base font-bold ${heading}`}>Profile</h3>
            <div className={`rounded-2xl p-5 ${card}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-base font-extrabold text-white">
                  {initials}
                </div>
                <div>
                  <p className={`text-sm font-bold ${heading}`}>{user?.name}</p>
                  <p className={`text-xs ${sub}`}>Local Reporter</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <User className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className={`text-xs ${sub} truncate`}>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className={`text-xs ${sub}`}>{user.phone}</span>
                  </div>
                )}
                {user?.area && (
                  <div className="flex items-center gap-2.5">
                    <MapIcon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className={`text-xs ${sub}`}>{user.area}</span>
                  </div>
                )}
                {user?.createdAt && (
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className={`text-xs ${sub}`}>
                      Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                <button
                  id="dashboard-edit-profile"
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isDark ? 'border-gray-700 text-gray-400 hover:border-indigo-600 hover:text-indigo-400'
                           : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                  onClick={() => { /* future: open profile edit modal */ }}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>
            </div>

            {/* Quick action */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
              <p className="text-sm font-bold mb-1">See all reports near you</p>
              <p className="text-xs text-indigo-200 mb-3">Browse issues in your local area on the map.</p>
              <button
                id="dashboard-go-to-map"
                onClick={() => { setView('map'); setPage('home'); }}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20 text-white text-xs font-semibold py-2 rounded-xl transition-all"
              >
                Open Map View →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
