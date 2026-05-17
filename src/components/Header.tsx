import React from 'react';
import { MapPin, List, Map, Plus, Sun, Moon, RefreshCw, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { view, setView, toggleTheme, toggleForm, theme, complaints, isLoading } = useApp();
  const isDark = theme === 'dark';

  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;

  return (
    <header
      className={`flex items-center justify-between px-4 sm:px-6 py-3.5 border-b z-50 relative ${
        isDark
          ? 'bg-gray-900/95 border-gray-800 backdrop-blur-md'
          : 'bg-white/95 border-gray-200 backdrop-blur-md'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className={`text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            GeoReport
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Smart Complaint System
          </p>
        </div>
        <h1 className={`sm:hidden text-base font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          GeoReport
        </h1>
      </div>

      {/* Centre stats */}
      <div className="flex items-center gap-3">
        {isLoading ? (
          <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
        ) : (
          <div className="flex items-center gap-1.5 text-xs">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {pendingCount} pending
            </span>
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className={`flex rounded-xl overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            id="view-map"
            onClick={() => setView('map')}
            title="Map View"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
              view === 'map'
                ? 'bg-indigo-600 text-white'
                : isDark
                ? 'bg-gray-800 text-gray-400 hover:text-gray-200'
                : 'bg-white text-gray-500 hover:text-gray-700'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </button>
          <button
            id="view-list"
            onClick={() => setView('list')}
            title="List View"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
              view === 'list'
                ? 'bg-indigo-600 text-white'
                : isDark
                ? 'bg-gray-800 text-gray-400 hover:text-gray-200'
                : 'bg-white text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>

        {/* Theme toggle */}
        <button
          id="toggle-theme"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* New complaint */}
        <button
          id="new-complaint"
          onClick={toggleForm}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
