import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
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

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      if (!token) localStorage.removeItem('user');
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const complaintService = {
  submitComplaint: async (title, description, category, priority) => {
    const response = await API.post('/complaints', { title, description, category, priority });
    return response.data;
  },
  getMyComplaints: async () => {
    const response = await API.get('/complaints/my');
    return response.data;
  },
  getAllComplaints: async () => {
    const response = await API.get('/complaints');
    return response.data;
  },
  updateComplaint: async (id, status, assignedStaff) => {
    const response = await API.put(`/complaints/${id}`, { status, assignedStaff });
    return response.data;
  }
};

export default API;
