// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import api from './axios';
const PROGRESS_URL = import.meta.env.VITE_API_PROGRESS_URL;

export const ProgressService = {
    saveProgress: (materialId : String) => {
        const response = api.post(`${PROGRESS_URL}/materials/${materialId}/complete`);
        return response;
    },
    fetchProgress: async (): Promise<number[]> => {
        const response = await api.get<number[]>(`${PROGRESS_URL}/completed-materials`);
        return response.data;
    }
};