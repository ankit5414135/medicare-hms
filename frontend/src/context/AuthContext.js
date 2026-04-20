import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import { connectSocket, disconnectSocket } from '../utils/socket';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('hms_token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hms_token');
      const savedUser = localStorage.getItem('hms_user');
      if (savedToken && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setToken(savedToken);
          connectSocket(parsed.id, parsed.role);
        } catch {
          localStorage.removeItem('hms_token');
          localStorage.removeItem('hms_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: newToken, data } = res.data;
      localStorage.setItem('hms_token', newToken);
      localStorage.setItem('hms_user', JSON.stringify(data));
      setToken(newToken);
      setUser(data);
      connectSocket(data.id, data.role);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}! 👋`);
      return { success: true, role: data.role };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {}
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    setUser(null);
    setToken(null);
    disconnectSocket();
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('hms_user', JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};