import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../api/auth.service';

// 1. Define the context value shape
export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

// 2. Pass the generic type to createContext (defaults to null)
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children } : { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  // const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      // setIsAuthenticated(false);
    }
  }, [token]);

  // Handle Login
  const login = async (username : string, password : string) => {
    try {
      const data = await AuthService.login({ username, password });
      const jwtToken = data.token;
      setToken(jwtToken);
      return { success: true };
    } catch (error : any) {
      const errorMessage: string = error.response?.data?.message ?? 'Login failed';
      return { 
        success: false, 
        message: errorMessage 
      };
      // return {
      //   success: false,
      //   message: error.response?.data?.message || 'Login failed',
      // };
    }
  };

  // Handle Registration
  const register = async (username : string, email : string, password : string) => {
    try {
      const data = await AuthService.register({
        username,
        email,
        password,
      });
      const jwtToken = data.token;
      setToken(jwtToken); // Logs in immediately after registration
      return { success: true };
    } catch (error : any) {
      const errorMessage: string = error.response?.data?.message ?? 'Registration failed';
      return { 
        success: false, 
        message: errorMessage 
      };
      // return {
      //   success: false,
      //   message: error.response?.data?.message || 'Registration failed',
      // };
    }
  };

  // Handle Logout
  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};