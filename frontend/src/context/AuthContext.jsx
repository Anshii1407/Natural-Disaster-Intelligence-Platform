import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContextDef';
import { loginApi, registerApi, getMeApi } from '../services/authApi';

const TOKEN_STORAGE_KEY = 'ndip_auth_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount from stored JWT token
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await getMeApi(storedToken);
        if (isMounted && response?.user) {
          setToken(storedToken);
          setUser(response.user);
        }
      } catch {
        // Token is invalid, expired, or server rejected it: safely purge
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginApi({ email, password });
    if (data?.token && data?.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error('Authentication response did not contain user credentials.');
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerApi({ name, email, password });
    if (data?.token && data?.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error('Registration response did not contain valid user credentials.');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
