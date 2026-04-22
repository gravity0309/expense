import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://expense-yvdp.onrender.com',
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser    = (data) => API.post('/api/auth/login', data);

// ── Expenses ──────────────────────────────────────────────────────────────────
export const getExpenses    = (params) => API.get('/api/expenses', { params });
export const addExpense     = (data)   => API.post('/api/expenses', data);
export const deleteExpense  = (id)     => API.delete(`/api/expenses/${id}`);

export default API;
