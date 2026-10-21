// Copyright (C) 2026 leahoangtrang. For the full notice: chao-web-app/LICENSE
import api from './axios';
import type {RegisterRequest, LoginRequest, AuthResponse, ResetPasswordRequest} from '../types/api';
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
    forgotPassword: async (data : {email : String}): Promise<String> => {
        const response = await api.post<String>(`${AUTH_URL}/forgot-password`, data);
        return response.data;
    },
    resetPassword: async (data : ResetPasswordRequest): Promise<String> => {
        const response = await api.post<String>(`${AUTH_URL}/reset-password`, data);
        return response.data;
    },
};