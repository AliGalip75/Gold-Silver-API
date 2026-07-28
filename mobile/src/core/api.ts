import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 60000, // Artırıldı: Render ve Neon DB'nin uyanması 50 saniyeyi bulabilir
  headers: {
    'Content-Type': 'application/json',
  },
});
