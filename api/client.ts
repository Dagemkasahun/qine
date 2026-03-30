// src/api/client.ts
import axios from 'axios'

// Dynamically pick API base URL
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Local development backend
    return 'http://localhost:5001/api'
  }
  // Production backend (Render)
  return import.meta.env.VITE_API_URL || 'https://qine-backend.onrender.com/api'
}

const API_URL = getBaseUrl()
console.log('🔵 API URL:', API_URL)

// Create Axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken')
      localStorage.removeItem('user')
      // Redirect to login page
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
