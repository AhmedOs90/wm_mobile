import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginDto } from '@/wm-api/types.gen';
import { authApi } from '@/services/authApi';
import { authStorage } from '@/lib/authStorage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  isAuthenticated: boolean;
  clearError: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
    const savedToken = await authStorage.getToken();
    const savedUser = await authStorage.getUser();
      if (savedToken) setToken( savedToken);
      if (savedUser) setUser( savedUser);
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, []);

  const setAuth = async (userData: User, authToken: string) => {
  setUser(userData);
  setToken(authToken);
  await authStorage.setToken(authToken);
  await authStorage.setUser(userData);
};


  const login = async (credentials: LoginDto) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(credentials);
      const { access_token, user } = response;
      
     await setAuth(user, access_token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setToken(null);
      await authStorage.clear(); 
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    setAuth,
    isAuthenticated: !!token,
    clearError,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};