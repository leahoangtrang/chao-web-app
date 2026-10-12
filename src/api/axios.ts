import axios from 'axios';

// Mirco-servicea, Different ports
// const LESSON_URL = import.meta.env.VITE_API_LESSON_URL;
// const AUTH_URL = import.meta.env.VITE_API_AUTH_URL;
// const USER_URL = import.meta.env.VITE_API_USER_URL;

// const createBaseApi = (baseURL : any) => {
//   const api = axios.create({
//     baseURL,
//     headers: { 'Content-Type': 'application/json' },
//   });

//   api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   return api;
// };

// export const authApi = createBaseApi(`${AUTH_URL}`);
// export const userApi = createBaseApi(`${USER_URL}`);
// export const lessonApi = createBaseApi(`${LESSON_URL}`);

// One port
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;