import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Complaint,
  ComplaintFormData,
  FilterState,
  AppView,
  Theme,
} from '../types';
import { MOCK_COMPLAINTS } from '../data/mockData';

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  complaints: Complaint[];
  filters: FilterState;
  selectedComplaint: Complaint | null;
  view: AppView;
  theme: Theme;
  showForm: boolean;
  isLoading: boolean;
}

const initialFilters: FilterState = {
  category: 'All',
  status: 'All',
  priority: 'All',
  searchQuery: '',
  sortBy: 'newest',
};

const initialState: AppState = {
  complaints: [],
  filters: initialFilters,
  selectedComplaint: null,
  view: 'map',
  theme: 'dark',
  showForm: false,
  isLoading: true,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'LOAD_COMPLAINTS'; payload: Complaint[] }
  | { type: 'ADD_COMPLAINT'; payload: Complaint }
  | { type: 'UPVOTE_COMPLAINT'; payload: string }
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: Complaint['status'] } }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SELECT_COMPLAINT'; payload: Complaint | null }
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_FORM' }
  | { type: 'SET_LOADING'; payload: boolean };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_COMPLAINTS':
      return { ...state, complaints: action.payload, isLoading: false };

    case 'ADD_COMPLAINT':
      return { ...state, complaints: [action.payload, ...state.complaints], showForm: false };

    case 'UPVOTE_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.map((c) =>
          c.id === action.payload ? { ...c, upvotes: c.upvotes + 1 } : c
        ),
      };

    case 'UPDATE_STATUS':
      return {
        ...state,
        complaints: state.complaints.map((c) =>
          c.id === action.payload.id
            ? { ...c, status: action.payload.status, updatedAt: new Date().toISOString() }
            : c
        ),
      };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: initialFilters };

    case 'SELECT_COMPLAINT':
      return { ...state, selectedComplaint: action.payload };

    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };

    case 'TOGGLE_FORM':
      return { ...state, showForm: !state.showForm };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue extends AppState {
  submitComplaint: (data: ComplaintFormData, userId?: string, userName?: string) => void;
  upvoteComplaint: (id: string) => void;
  updateStatus: (id: string, status: Complaint['status']) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  selectComplaint: (complaint: Complaint | null) => void;
  setView: (view: AppView) => void;
  toggleTheme: () => void;
  toggleForm: () => void;
  filteredComplaints: Complaint[];
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate async load (replace with real API call)
  useEffect(() => {
    const stored = localStorage.getItem('geo_complaints');
    if (stored) {
      try {
        dispatch({ type: 'LOAD_COMPLAINTS', payload: JSON.parse(stored) });
      } catch {
        dispatch({ type: 'LOAD_COMPLAINTS', payload: MOCK_COMPLAINTS });
      }
    } else {
      setTimeout(() => {
        dispatch({ type: 'LOAD_COMPLAINTS', payload: MOCK_COMPLAINTS });
      }, 600);
    }

    const storedTheme = localStorage.getItem('geo_theme') as Theme | null;
    if (storedTheme) dispatch({ type: storedTheme === 'light' ? 'TOGGLE_THEME' : 'TOGGLE_THEME' });
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('geo_complaints', JSON.stringify(state.complaints));
    }
  }, [state.complaints, state.isLoading]);

  useEffect(() => {
    localStorage.setItem('geo_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // ── Filtered & sorted complaints ──────────────────────────────────────────

  const filteredComplaints = React.useMemo(() => {
    let result = [...state.complaints];

    if (state.filters.category !== 'All') {
      result = result.filter((c) => c.category === state.filters.category);
    }
    if (state.filters.status !== 'All') {
      result = result.filter((c) => c.status === state.filters.status);
    }
    if (state.filters.priority !== 'All') {
      result = result.filter((c) => c.priority === state.filters.priority);
    }
    if (state.filters.searchQuery) {
      const q = state.filters.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.address?.toLowerCase().includes(q)
      );
    }

    switch (state.filters.sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case 'priority':
        const pOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        result.sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);
        break;
      case 'upvotes':
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      default: // newest
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return result;
  }, [state.complaints, state.filters]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const submitComplaint = useCallback((data: ComplaintFormData, userId = 'guest', userName = 'You') => {
    if (!data.coordinates) return;
    const newComplaint: Complaint = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'Pending',
      coordinates: data.coordinates,
      address: data.address,
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      userName,
      upvotes: 0,
    };
    dispatch({ type: 'ADD_COMPLAINT', payload: newComplaint });
  }, []);

  const upvoteComplaint = useCallback((id: string) => {
    dispatch({ type: 'UPVOTE_COMPLAINT', payload: id });
  }, []);

  const updateStatus = useCallback((id: string, status: Complaint['status']) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), []);
  const selectComplaint = useCallback((c: Complaint | null) => dispatch({ type: 'SELECT_COMPLAINT', payload: c }), []);
  const setView = useCallback((v: AppView) => dispatch({ type: 'SET_VIEW', payload: v }), []);
  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);
  const toggleForm = useCallback(() => dispatch({ type: 'TOGGLE_FORM' }), []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        submitComplaint,
        upvoteComplaint,
        updateStatus,
        setFilters,
        resetFilters,
        selectComplaint,
        setView,
        toggleTheme,
        toggleForm,
        filteredComplaints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
