import api from './axios';
import type {RegisterRequest, LoginRequest, AuthResponse} from '../types/api';
const AUTH_URL = import.meta.env.VITE_API_AUTH_URL;

export const AuthService = {
    register: async (data : RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${AUTH_URL}/register`, data);
        return response.data;
    },
    login: async (data : LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${AUTH_URL}/login`, data);
        return response.data;
    },
};