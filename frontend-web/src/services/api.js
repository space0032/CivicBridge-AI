import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const programService = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data)
};

export const healthcareService = {
  getAll: (params) => api.get('/healthcare', { params }),
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

export default api;
