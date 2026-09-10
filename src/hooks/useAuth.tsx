import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authStorage, authApi } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!authStorage.getToken());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.login(username, password);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.register(username, password);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
