import React, { createContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminViewMode, setAdminViewMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const switchRole = async (targetRole) => {
    try {
      // Trigger a custom event to notify Navbar/Overlay to show switching screen
      window.dispatchEvent(new CustomEvent('workspace-switching-start', { detail: targetRole }));
      
      const { data } = await API.put('/users/switch-role', { role: targetRole });
      
      // Update local user state
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...parsed, ...data.user };
        setUser(merged);
        localStorage.setItem('userInfo', JSON.stringify(merged));
      }
      
      // Fire end event
      window.dispatchEvent(new CustomEvent('workspace-switching-end', { detail: targetRole }));
      return { success: true };
    } catch (err) {
      window.dispatchEvent(new CustomEvent('workspace-switching-failed'));
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to switch workspace',
      };
    }
  };

  const persistUser = (data) => {
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await API.get('/auth/profile');
      const stored = localStorage.getItem('userInfo');
      const token = stored ? JSON.parse(stored).token : null;
      if (token) {
        const merged = { ...data, token };
        persistUser(merged);
        return merged;
      }
    } catch {
      // Token expired or invalid — keep stored user for now
    }
    return null;
  }, []);

  useEffect(() => {
    const init = async () => {
      const loggedInUser = localStorage.getItem('userInfo');
      if (loggedInUser) {
        try {
          const parsed = JSON.parse(loggedInUser);
          setUser(parsed);
          await refreshProfile();
        } catch {
          localStorage.removeItem('userInfo');
        }
      }
      setLoading(false);
    };
    init();
  }, [refreshProfile]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      persistUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { email, password, name });
      persistUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email',
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await API.post('/auth/reset-password', { token, password });
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password',
      };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const { data } = await API.post('/auth/google-login', { credential });
      persistUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Google login failed',
      };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await API.put('/users/profile', updates);
      const updatedUser = { ...user, ...data, token: user?.token };
      persistUser(updatedUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const activeUser = user ? {
    ...user,
    role: user.viewMode || user.role || 'USER'
  } : null;

  return (
    <AuthContext.Provider value={{
      user: activeUser,
      originalRole: user?.realRole || user?.role || 'USER',
      switchRole,
      adminViewMode,
      setAdminViewMode,
      login,
      register,
      logout,
      loading,
      forgotPassword,
      resetPassword,
      googleLogin,
      updateProfile,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
