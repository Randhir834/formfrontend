import axios from 'axios';

// Backend API URL Configuration
// Priority: Environment Variable > Hardcoded Production URL
const getApiUrl = () => {
  // Check if environment variable exists
  if (process.env.REACT_APP_API_URL) {
    console.log('✅ Using REACT_APP_API_URL from environment:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback to production URL
  const productionUrl = 'https://formbackend-1-v0n3.onrender.com/api';
  console.log('⚠️  REACT_APP_API_URL not set, using fallback:', productionUrl);
  return productionUrl;
};

const API_URL = getApiUrl();

// Extract base URL (without /api) for image URLs
export const getBackendUrl = () => {
  return API_URL.replace('/api', '');
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend the backend URL
  return `${getBackendUrl()}${imagePath}`;
};

// Log the final API URL being used
console.log('🌐 API Base URL configured as:', API_URL);
console.log('🖼️  Backend URL for images:', getBackendUrl());

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.config.url, '- Status:', response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ API Error Response:', {
        url: error.config?.url,
        status: error.response.status,
        message: error.response.data?.message || error.message
      });
    } else if (error.request) {
      console.error('❌ Network Error - No response received:', error.message);
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const signup = (data) => {
  console.log('🔐 Signup request to:', `${API_URL}/auth/signup`);
  return api.post('/auth/signup', data);
};

export const login = (data) => {
  console.log('🔐 Login request to:', `${API_URL}/auth/login`);
  return api.post('/auth/login', data);
};

export const getProfile = () => api.get('/auth/me');

// Form APIs
export const submitForm = (formData) => api.post('/forms/submit', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateForm = (id, formData) => api.put(`/forms/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMyForms = () => api.get('/forms/my-forms');
export const getForm = (id) => api.get(`/forms/${id}`);
export const deleteForm = (id) => api.delete(`/forms/${id}`);
export const submitFeedback = (formId, updateId, data) => api.post(`/forms/${formId}/feedback/${updateId}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Admin APIs
export const getAdminStats = () => api.get('/admin/stats');
export const getAllForms = (params) => api.get('/admin/forms', { params });
export const updateFormStatus = (id, data) => api.put(`/admin/forms/${id}/update`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteFormAdmin = (id) => api.delete(`/admin/forms/${id}`);

export default api;
