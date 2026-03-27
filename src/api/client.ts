// src/api/client.ts
import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5001/api';
  }
  // Production URL
  return 'https://qine-backend.onrender.com/api';
};

const API_URL = getBaseUrl();

console.log('🔵 API URL:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      // You can add navigation to login here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);