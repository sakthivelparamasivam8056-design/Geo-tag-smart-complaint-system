import React from 'react';
import { MapPin, Clock, ThumbsUp, ChevronRight, AlertCircle } from 'lucide-react';
import { Complaint } from '../types';
import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils/helpers';
import {
  CATEGORY_ICONS,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from '../utils/constants';

interface Props {
  complaint: Complaint;
  compact?: boolean;
}

const ComplaintCard: React.FC<Props> = ({ complaint, compact = false }) => {
  const { selectComplaint, upvoteComplaint, theme } = useApp();
  const isDark = theme === 'dark';

  const statusColor = STATUS_COLORS[complaint.status];
  const priorityColor = PRIORITY_COLORS[complaint.priority];

  const card = isDark
    ? 'bg-gray-800/80 border-gray-700/60 hover:bg-gray-800 hover:border-gray-600'
    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300';

  return (
    <div
      id={`card-${complaint.id}`}
      onClick={() => selectComplaint(complaint)}
      className={`${card} border rounded-2xl p-4 cursor-pointer transition-all duration-200 group`}
      style={{ borderLeftColor: statusColor, borderLeftWidth: 3 }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{CATEGORY_ICONS[complaint.category]}</span>
          <h3 className={`font-semibold text-sm leading-snug truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {complaint.title}
          </h3>
        </div>
        <ChevronRight
          className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
        />
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {/* Status */}
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: statusColor + '22', color: statusColor }}
        >
          {complaint.status}
        </span>
        {/* Priority */}
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ backgroundColor: priorityColor + '22', color: priorityColor }}
        >
          <AlertCircle className="w-2.5 h-2.5" />
          {complaint.priority}
        </span>
        {/* Category */}
        <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          {complaint.category}
        </span>
      </div>

      {/* Description (if not compact) */}
      {!compact && (
        <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {complaint.description}
        </p>
      )}

      {/* Footer */}
      <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{complaint.address || 'Unknown location'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(complaint.timestamp)}
          </span>
        </div>
        <button
          id={`upvote-${complaint.id}`}
          onClick={(e) => { e.stopPropagation(); upvoteComplaint(complaint.id); }}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-indigo-400' : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          <span className="font-semibold">{complaint.upvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default ComplaintCard;
