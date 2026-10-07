import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mini-support-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function readableError(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? 'Une erreur réseau est survenue.';
  return 'Une erreur inattendue est survenue.';
}

