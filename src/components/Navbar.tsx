import React, { useState } from 'react';
import {
  MapPin, Map, List, LayoutDashboard, Plus, Sun, Moon,
  LogIn, UserPlus, LogOut, Menu, X, Activity, RefreshCw, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { view, setView, toggleTheme, toggleForm, theme, complaints, isLoading } = useApp();
  const { user, isAuthenticated, logout, setPage, page } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const initials = user?.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '';

  const base = isDark
    ? 'bg-gray-900/95 border-gray-800 text-gray-100'
    : 'bg-white/95 border-gray-200 text-gray-900';

  // Nav link helper
  const navLink = (label: string, icon: React.ReactNode, active: boolean, onClick: () => void, id: string) => (
    <button
      id={id}
      onClick={() => { onClick(); setMobileOpen(false); }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
          : isDark
          ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <header className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b z-50 relative backdrop-blur-md ${base}`}>
        {/* ── Brand ─────────────────────────────────────────────────────────── */}
        <button
          id="nav-brand"
          onClick={() => { setPage('home'); setMobileOpen(false); }}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className={`text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              GeoReport
            </span>
            <span className={`hidden lg:block text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Smart Complaint System
            </span>
          </div>
          <span className={`sm:hidden text-base font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            GeoReport
          </span>
        </button>

        {/* ── Desktop Nav Links ─────────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLink('Map', <Map className="w-4 h-4" />, page === 'home' && view === 'map',
            () => { setPage('home'); setView('map'); }, 'nav-map')}
          {navLink('List', <List className="w-4 h-4" />, page === 'home' && view === 'list',
            () => { setPage('home'); setView('list'); }, 'nav-list')}
          {isAuthenticated && navLink(
            'Dashboard', <LayoutDashboard className="w-4 h-4" />, page === 'dashboard',
            () => setPage('dashboard'), 'nav-dashboard'
          )}
        </nav>

        {/* ── Right Controls ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* Pending indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {isLoading ? (
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : pendingCount > 0 ? (
              <div className="flex items-center gap-1 text-xs">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  {pendingCount} pending
                </span>
              </div>
            ) : null}
          </div>

          {/* Theme toggle */}
          <button
            id="nav-toggle-theme"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Report button */}
              <button
                id="nav-new-complaint"
                onClick={() => { setPage('home'); setTimeout(() => toggleForm(), 50); }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Report Issue</span>
                <span className="lg:hidden">Report</span>
              </button>

              {/* Avatar / profile */}
              <button
                id="nav-dashboard"
                onClick={() => setPage('dashboard')}
                title={`${user?.name} – Dashboard`}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all hover:scale-105 ${
                  page === 'dashboard'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
                    : isDark
                    ? 'bg-gray-800 text-indigo-300 hover:bg-gray-700'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                {initials || <User className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                id="nav-login"
                onClick={() => setPage('login')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
              <button
                id="nav-signup"
                onClick={() => setPage('signup')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Dropdown ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className={`md:hidden border-b z-40 px-4 py-3 space-y-1 ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          {navLink('Map View', <Map className="w-4 h-4" />, page === 'home' && view === 'map',
            () => { setPage('home'); setView('map'); }, 'mobile-nav-map')}
          {navLink('List View', <List className="w-4 h-4" />, page === 'home' && view === 'list',
            () => { setPage('home'); setView('list'); }, 'mobile-nav-list')}

          {isAuthenticated ? (
            <>
              {navLink('Dashboard', <LayoutDashboard className="w-4 h-4" />, page === 'dashboard',
                () => setPage('dashboard'), 'mobile-nav-dashboard')}
              <button
                id="mobile-nav-report"
                onClick={() => { setPage('home'); setMobileOpen(false); setTimeout(() => toggleForm(), 100); }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold transition-all"
              >
                <Plus className="w-4 h-4" /> Report an Issue
              </button>
              <button
                id="mobile-nav-logout"
                onClick={() => { logout(); setMobileOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-4 h-4" /> Sign Out ({user?.name?.split(' ')[0]})
              </button>
            </>
          ) : (
            <>
              <button id="mobile-nav-login" onClick={() => { setPage('login'); setMobileOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button id="mobile-nav-signup" onClick={() => { setPage('signup'); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold">
                <UserPlus className="w-4 h-4" /> Create Account
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
