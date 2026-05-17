import React from 'react';
import { X, MapPin, Clock, ThumbsUp, User, RefreshCw, AlertCircle, CheckCircle, Loader, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORY_ICONS, STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import { timeAgo, formatDate } from '../utils/helpers';
import { ComplaintStatus } from '../types';

const statusIcons: Record<ComplaintStatus, React.ReactNode> = {
  Pending: <AlertCircle className="w-4 h-4" />,
  'In Progress': <Loader className="w-4 h-4 animate-spin" />,
  Resolved: <CheckCircle className="w-4 h-4" />,
  Rejected: <XCircle className="w-4 h-4" />,
};

const ComplaintDetail: React.FC = () => {
  const { selectedComplaint, selectComplaint, upvoteComplaint, updateStatus, theme } = useApp();
  const isDark = theme === 'dark';

  if (!selectedComplaint) return null;

  const c = selectedComplaint;
  const statusColor = STATUS_COLORS[c.status];
  const priorityColor = PRIORITY_COLORS[c.priority];

  const overlay = isDark ? 'bg-gray-900/60' : 'bg-gray-500/30';
  const panel = isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900';
  const muted = isDark ? 'text-gray-400' : 'text-gray-500';
  const divider = isDark ? 'border-gray-800' : 'border-gray-100';
  const sectionBg = isDark ? 'bg-gray-800/60' : 'bg-gray-50';

  return (
    <div
      className={`fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4 ${overlay} backdrop-blur-sm`}
      onClick={() => selectComplaint(null)}
    >
      <div
        className={`${panel} w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl mt-0.5 flex-shrink-0">{CATEGORY_ICONS[c.category]}</span>
            <div className="min-w-0">
              <h2 className="font-bold text-base leading-snug">{c.title}</h2>
              <p className={`text-xs mt-0.5 ${muted}`}>{c.category}</p>
            </div>
          </div>
          <button
            onClick={() => selectComplaint(null)}
            aria-label="Close detail"
            className={`p-1.5 rounded-xl flex-shrink-0 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-4">
          {/* Status + Priority */}
          <div className="flex gap-2 flex-wrap">
            <span
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl"
              style={{ background: statusColor + '20', color: statusColor }}
            >
              {statusIcons[c.status]}
              {c.status}
            </span>
            <span
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl"
              style={{ background: priorityColor + '20', color: priorityColor }}
            >
              <AlertCircle className="w-4 h-4" />
              {c.priority} Priority
            </span>
          </div>

          {/* Description */}
          <div className={`${sectionBg} rounded-xl p-4`}>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {c.description}
            </p>
          </div>

          {/* Meta */}
          <div className={`${sectionBg} rounded-xl p-4 space-y-2.5`}>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className={`w-4 h-4 flex-shrink-0 ${muted}`} />
              <span>{c.address || `${c.coordinates.lat.toFixed(4)}, ${c.coordinates.lng.toFixed(4)}`}</span>
            </div>
            <div className={`border-t ${divider}`} />
            <div className="flex items-center gap-2 text-sm">
              <Clock className={`w-4 h-4 flex-shrink-0 ${muted}`} />
              <span>{formatDate(c.timestamp)}</span>
            </div>
            <div className={`border-t ${divider}`} />
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className={`w-4 h-4 flex-shrink-0 ${muted}`} />
              <span>Updated {timeAgo(c.updatedAt)}</span>
            </div>
            <div className={`border-t ${divider}`} />
            <div className="flex items-center gap-2 text-sm">
              <User className={`w-4 h-4 flex-shrink-0 ${muted}`} />
              <span>Reported by <strong>{c.userName}</strong></span>
            </div>
          </div>

          {/* Status update */}
          <div className={`${sectionBg} rounded-xl p-4`}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-2.5 ${muted}`}>Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {(['Pending', 'In Progress', 'Resolved', 'Rejected'] as ComplaintStatus[]).map((s) => (
                <button
                  key={s}
                  id={`status-${s.replace(' ', '-').toLowerCase()}-${c.id}`}
                  onClick={() => updateStatus(c.id, s)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${
                    c.status === s
                      ? 'opacity-100 scale-[1.02]'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                  style={{
                    borderColor: STATUS_COLORS[s],
                    background: c.status === s ? STATUS_COLORS[s] + '30' : 'transparent',
                    color: STATUS_COLORS[s],
                  }}
                >
                  {statusIcons[s]}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Upvote */}
          <button
            id={`detail-upvote-${c.id}`}
            onClick={() => upvoteComplaint(c.id)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <ThumbsUp className="w-4 h-4" />
            Upvote this complaint ({c.upvotes})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
