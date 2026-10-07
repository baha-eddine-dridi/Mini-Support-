import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import type { User } from '../types';

interface AuthValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);
const USER_KEY = 'mini-support-user';
const TOKEN_KEY = 'mini-support-token';

function saveSession(user: User, token: string): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });

  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data.user, data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    const { data } = await api.post('/auth/register', { name, email, password });
    saveSession(data.user, data.token);
    setUser(data.user);
  }

  function logout(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

