// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 백엔드 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const loginTime = localStorage.getItem('auth_login_time');

  if (token && loginTime) {
    const elapsed = Date.now() - parseInt(loginTime, 10);
    const MAX_DURATION = 10 * 60 * 1000; // 10분

    if (elapsed < MAX_DURATION) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 10분 초과 → 자동 로그아웃
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_login_time');
      window.location.href = '/auth/login';
    }
  }

  return config;
});

export { api };