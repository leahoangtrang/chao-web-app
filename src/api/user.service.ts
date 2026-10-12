import api from './axios';
import type {UserResponse, UpdateUserRequest} from '../types/api';
const URL = import.meta.env.VITE_API_USER_URL;

export const UserService = {
    getUser: async () : Promise<UserResponse> => {
        const response = await api.get<UserResponse>(`${URL}`);
        return response.data;
    },
    updateUser: async (data: UpdateUserRequest) : Promise<String> => {
        const response = await api.put<String>(`${URL}`, data);
        return response.data;
    },
    deleteUser: async () : Promise<String> => {
        const response = await api.delete<String>(`${URL}`);
        return response.data;
    },
};