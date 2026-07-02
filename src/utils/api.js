import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
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
