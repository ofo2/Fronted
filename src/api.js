import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with auth token
const api = axios.create({
  baseURL: API
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginAdmin = async (username, password) => {
  const response = await axios.post(`${API}/auth/login`, { username, password });
  return response.data;
};

export const registerAdmin = async (username, password, telegram_id) => {
  const response = await axios.post(`${API}/auth/register`, { username, password, telegram_id });
  return response.data;
};

// User APIs
export const getUsers = async () => {
  const response = await api.get('/users/');
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await api.patch(`/users/${userId}/block`);
  return response.data;
};

// Order APIs
export const getOrders = async (status) => {
  const url = status ? `/orders/?status=${status}` : '/orders/';
  const response = await api.get(url);
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const updateOrder = async (orderId, updates) => {
  const response = await api.patch(`/orders/${orderId}`, updates);
  return response.data;
};

// Product APIs
export const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

export const updateProduct = async (productId, updates) => {
  const response = await api.patch(`/products/${productId}`, updates);
  return response.data;
};

// Settings APIs
export const getSettings = async () => {
  const response = await api.get('/settings/');
  return response.data;
};

export const updateSettings = async (updates) => {
  const response = await api.put('/settings/', updates);
  return response.data;
};

// Statistics APIs
export const getStatistics = async () => {
  const response = await api.get('/statistics/');
  return response.data;
};

export default api;
