import React from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, STATUSES, PRIORITIES } from '../utils/constants';
import { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '../types';

const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredComplaints, complaints, theme } = useApp();
  const isDark = theme === 'dark';

  const base = isDark
    ? 'bg-gray-800 border-gray-700 text-gray-200'
    : 'bg-white border-gray-200 text-gray-800';
  const selectStyle = isDark
    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-500'
    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-indigo-500';

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.searchQuery !== '';

  return (
    <div className={`${base} border-b px-4 py-3 space-y-3`}>
      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            id="filter-search"
            type="text"
            placeholder="Search complaints…"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none transition-colors ${selectStyle}`}
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{filteredComplaints.length}/{complaints.length}</span>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category */}
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value as ComplaintCategory | 'All' })}
          className={`border rounded-xl px-3 py-1.5 text-xs outline-none transition-colors flex-1 min-w-[120px] ${selectStyle}`}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status */}
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as ComplaintStatus | 'All' })}
          className={`border rounded-xl px-3 py-1.5 text-xs outline-none transition-colors flex-1 min-w-[100px] ${selectStyle}`}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Priority */}
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value as ComplaintPriority | 'All' })}
          className={`border rounded-xl px-3 py-1.5 text-xs outline-none transition-colors flex-1 min-w-[100px] ${selectStyle}`}
        >
          <option value="All">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Sort */}
        <div className="relative flex-1 min-w-[110px]">
          <ArrowUpDown className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <select
            id="filter-sort"
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as any })}
            className={`w-full border rounded-xl pl-7 pr-3 py-1.5 text-xs outline-none transition-colors ${selectStyle}`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            id="filter-reset"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 font-semibold px-2 py-1.5 rounded-xl hover:bg-indigo-500/10 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
