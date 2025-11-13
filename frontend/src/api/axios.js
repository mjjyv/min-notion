import axios from 'axios';

// Lấy Base URL từ biến môi trường của Vite
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor (Middleware cho request)
 * Tự động lấy token từ localStorage và đính kèm vào header Authorization
 * cho MỌI request gửi đi.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;