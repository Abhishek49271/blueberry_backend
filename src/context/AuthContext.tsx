import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Address } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (phone: string, name?: string) => void;
  setSession: (user: any, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (addr: Address) => void;
  removeAddress: (id: string) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('bluberry_token');
    const u = localStorage.getItem('bluberry_user');
    if (t && u) {
      try {
        setToken(t);
        setUser(JSON.parse(u));
      } catch {}
    }
  }, []);

  const setSession = (u: any, t: string) => {
    const userObj: User = {
      id: u.id,
      name: u.name,
      phone: u.phone,
      isAdmin: u.role === 'admin',
      addresses: [],
    };
    setUser(userObj);
    setToken(t);
    localStorage.setItem('bluberry_token', t);
    localStorage.setItem('bluberry_user', JSON.stringify(userObj));
  };

  const login = (phone: string, name = 'Guest') => {
    // Legacy local fallback — prefer API login page
    const isAdmin = phone === '9999999999';
    const u: User = {
      id: isAdmin ? 'admin-1' : `u-${Date.now()}`,
      name: isAdmin ? 'Café Admin' : name,
      phone,
      isAdmin,
      addresses: [],
    };
    setUser(u);
    localStorage.setItem('bluberry_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bluberry_user');
    localStorage.removeItem('bluberry_token');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...data };
    setUser(next);
    localStorage.setItem('bluberry_user', JSON.stringify(next));
  };

  const addAddress = (addr: Address) => {
    if (!user) return;
    const next = { ...user, addresses: [...user.addresses, addr] };
    setUser(next);
    localStorage.setItem('bluberry_user', JSON.stringify(next));
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const next = { ...user, addresses: user.addresses.filter((a) => a.id !== id) };
    setUser(next);
    localStorage.setItem('bluberry_user', JSON.stringify(next));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        setSession,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        isAdmin: !!user?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
