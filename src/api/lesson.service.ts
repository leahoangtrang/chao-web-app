// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import api from './axios';
import type { Unit, LessonDetail } from '../types/api';
const LESSON_URL = import.meta.env.VITE_API_LESSON_URL;

export const LessonService = {
  getUnitsByLevel: async (levelId : string): Promise<Unit[]> => {
    const response = await api.get<Unit[]>(`${LESSON_URL}/levels/${levelId}`);
    return response.data
  },
  getLessonById: async (lessonId : string): Promise<LessonDetail> => {
    const response = await api.get<LessonDetail>(`${LESSON_URL}/lessons/${lessonId}`);
    return response.data;
  },
//   create: (data) => api.post(`${LESSON_URL}`, data),
};