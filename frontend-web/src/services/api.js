import axios from 'axios';
import applicationService from './application';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const programService = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data)
};

export const healthcareService = {
  getAll: (params) => api.get('/healthcare', { params }),
  getById: (id) => api.get(`/healthcare/${id}`),
  getNearby: (latitude, longitude, radiusKm = 10) =>
    api.get('/healthcare/nearby', { params: { latitude, longitude, radiusKm } }),
  create: (data) => api.post('/healthcare', data)
};

export const voiceService = {
  processQuery: (data) => api.post('/voice-query', data),
  getHistory: (userId) => api.get(`/voice-query/history/${userId}`)
};

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const adminService = {
  getStats: () => api.get('/stats')
};

export { applicationService };

export default api;
