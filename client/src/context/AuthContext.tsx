import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('admin_user'));

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, username: user } = res.data;
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', user);
    setToken(token);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUsername(null);
  };

  useEffect(() => {
    // Verify token on mount
    if (token) {
      api.get('/auth/me').catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
