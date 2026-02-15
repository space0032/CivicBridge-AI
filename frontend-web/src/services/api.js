import axios from 'axios';
import applicationService from './application';
import logger from '../utils/logger';
import { mapErrorCodeToMessage } from '../utils/errorMapper';
import i18n from '../i18n';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

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

const handleApiError = (error) => {
  // Log the error.
  logger.error('API Error:', error);

  // Handle specific HTTP status codes.
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else {
      throw new Error(mapErrorCodeToMessage(error.response.status));
    }
  } else if (error.request) {
    throw new Error(i18n.t('api_error_network'));
  } else {
    throw new Error(i18n.t('unexpected_error'));
  }
};

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      handleApiError(error);
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export const programService = {
  getAll: (params) => api.get(API_ENDPOINTS.PROGRAMS, { params }),
  getById: (id) => api.get(`${API_ENDPOINTS.PROGRAMS}/${id}`),
  create: (data) => api.post(API_ENDPOINTS.PROGRAMS, data),
  update: (id, data) => api.put(`${API_ENDPOINTS.PROGRAMS}/${id}`, data)
};

export const healthcareService = {
  getAll: (params) => api.get(API_ENDPOINTS.HEALTHCARE, { params }),
  getById: (id) => api.get(`${API_ENDPOINTS.HEALTHCARE}/${id}`),
  getNearby: (latitude, longitude, radiusKm = 10) =>
    api.get(`${API_ENDPOINTS.HEALTHCARE}/nearby`, { params: { latitude, longitude, radiusKm } }),
  create: (data) => api.post(API_ENDPOINTS.HEALTHCARE, data),
  update: (id, data) => api.put(`${API_ENDPOINTS.HEALTHCARE}/${id}`, data)
};

export const voiceService = {
  processQuery: (data) => api.post(API_ENDPOINTS.VOICE_QUERY, data),
  getHistory: (userId) => api.get(`${API_ENDPOINTS.VOICE_QUERY}/history/${userId}`)
};

export const authService = {
  register: (data) => api.post(`${API_ENDPOINTS.AUTH}/register`, data),
  login: (data) => api.post(`${API_ENDPOINTS.AUTH}/login`, data)
};

export const adminService = {
  getStats: () => api.get(API_ENDPOINTS.STATS)
};

export { applicationService };

export default api;
