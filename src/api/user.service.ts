// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import api from './axios';
import type {UserResponse, UpdateUserRequest, ChangePasswordRequest, UpdateUserResponse} from '../types/api';
const URL = import.meta.env.VITE_API_USER_URL;

export const UserService = {
    getUser: async () : Promise<UserResponse> => {
        try {
            const response = await api.get<UserResponse>(`${URL}`);
            return response.data;
        } catch (error) {
            throw error;
        }
        
    },
    updateUser: async (data: UpdateUserRequest) : Promise<UpdateUserResponse> => {
        try {
            const response = await api.put<UpdateUserResponse>(`${URL}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
        
    },
    changePassword: async (data: ChangePasswordRequest) : Promise<String> => {
        try {
            const response = await api.put<String>(`${URL}/password`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
        
    },
    deleteUser: async () : Promise<String> => {
        try {
            const response = await api.delete<String>(`${URL}`);
            return response.data;
        } catch (error) {
            throw error
        }
       
    },
};