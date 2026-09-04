import axios from 'axios';

// In dev, Vite's proxy (vite.config.js) forwards '/api' to the local backend.
// In production there's no dev-server proxy, so VITE_API_URL must point at
// the deployed backend (e.g. https://your-backend.onrender.com/api).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';
