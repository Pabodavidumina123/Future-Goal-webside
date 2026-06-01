import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Maps to backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization Token on each request
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

export default api;
