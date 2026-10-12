// Using fetch
// const MAIN_URL = import.meta.env.VITE_API_LESSON_URL;
// export async function fetchFromApi<T>(endpoint: string): Promise<T> { 
//   const response = await fetch(`${MAIN_URL}${endpoint}`, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`API Error: ${response.status} ${response.statusText}`);
//   }

//   return response.json();
// }

// import type { Unit, LessonDetail } from '../types/api';

// export const lessonService = {
//   getUnitsByLevel: (levelId: string) => {
//     return fetchFromApi<Unit[]>(`/levels/${levelId}/units`);
//   },
  
//   getLessonDetails: (lessonId: string) => {
//     return fetchFromApi<LessonDetail>(`/lessons/${lessonId}`);
//   },
// };

// Using axios
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