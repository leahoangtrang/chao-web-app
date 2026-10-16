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

// Request interceptor with proper error handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Catches expired/invalid tokens globally)
api.interceptors.response.use(
  (response) => response, // If response is good, just pass it through
  (error) => {
    // Check if the backend sent a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      
      // Redirect the user to login (using window.location forces a clean state reset)
      // You can also append a query param to show a "Session expired" message on your login page
      window.location.href = '/chao/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;