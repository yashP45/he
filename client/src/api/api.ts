import axios from 'axios';

const api = axios.create({
  baseURL: 'https://invoice-generate-1.onrender.com/api'
});

export const register = (data: { name: string; email: string; password: string }) => api.post('/auth/register', data);
export const login = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const addProduct = (data: { name: string; quantity: number; rate: number }, token: string) => api.post('/products', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const generatePDF = (token: string) => api.post('/generate-pdf', {}, {
  headers: { Authorization: `Bearer ${token}` },
  responseType: 'blob'
});

export default api;
