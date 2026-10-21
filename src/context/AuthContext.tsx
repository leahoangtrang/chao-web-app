// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../api/auth.service';
// import { UserService } from '../api/user.service';

// Define what a User object looks like
// export interface User {
//   id?: number | string;
//   username: string;
//   email?: string;
//   completedLessonsCount?: number;
//   learnedVocabCount?: number;
// }

// 1. Define the context value shape
export interface AuthContextType {
  // user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // login: (username: string, password: string, userData?: User) => Promise<{ success: boolean; message?: string }>;
  login: (username: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; message?: string }>;
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

  // 1. Initialize user from localStorage
  // const [user, setUser] = useState<User | null>(() => {
  //   const savedUser = localStorage.getItem('user');
  //   return savedUser ? JSON.parse(savedUser) : null;
  // });

  // Handle Login
  const login = async (email : string, password : string, rememberMe : boolean) => {
    try {
      const data = await AuthService.login({ email, password, rememberMe });
      const jwtToken = data.token;
      setToken(jwtToken);

      // const response = await UserService.getUser();
      // if (response) {
      // setUser(response);
      // localStorage.setItem('user', JSON.stringify(response));
    // }
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
    // setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      // value={{ user, token, isAuthenticated, login, register, logout }}
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