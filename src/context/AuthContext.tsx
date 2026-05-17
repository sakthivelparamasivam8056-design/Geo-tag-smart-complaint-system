import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, AppPage } from '../types';

// ─── Stored user record (includes password hash) ──────────────────────────────
interface StoredUser extends User {
  passwordHash: string; // simple base64 "hash" for demo
}

function simpleHash(s: string) {
  return btoa(encodeURIComponent(s));
}

// ─── Context value ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  page: AppPage;
  setPage: (p: AppPage) => void;
  login: (email: string, password: string) => string | null; // returns error msg or null
  signup: (name: string, email: string, password: string, phone?: string, area?: string) => string | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<AppPage>('home');

  // Rehydrate session
  useEffect(() => {
    const raw = localStorage.getItem('geo_session');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    try { return JSON.parse(localStorage.getItem('geo_users') || '[]'); } catch { return []; }
  };
  const saveUsers = (users: StoredUser[]) =>
    localStorage.setItem('geo_users', JSON.stringify(users));

  const login = useCallback((email: string, password: string): string | null => {
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return 'No account found with this email.';
    if (found.passwordHash !== simpleHash(password)) return 'Incorrect password.';
    const { passwordHash: _ph, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('geo_session', JSON.stringify(safeUser));
    setPage('home');
    return null;
  }, []);

  const signup = useCallback(
    (name: string, email: string, password: string, phone?: string, area?: string): string | null => {
      const users = getUsers();
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return 'An account with this email already exists.';
      }
      const newUser: StoredUser = {
        id: uuidv4(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone,
        area,
        createdAt: new Date().toISOString(),
        passwordHash: simpleHash(password),
      };
      saveUsers([...users, newUser]);
      const { passwordHash: _ph, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem('geo_session', JSON.stringify(safeUser));
      setPage('home');
      return null;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('geo_session');
    setPage('home');
  }, []);

  return (
    <AuthContext.Provider value={{ user, page, setPage, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
