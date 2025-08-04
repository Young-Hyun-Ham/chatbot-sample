import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const SESSION_DURATION = 1 * 60 * 1000; // 1분

export const useSessionTimer = () => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 로그인 시간 불러오기 (초기 1회)
  useEffect(() => {
    const loginTime = localStorage.getItem('auth_login_time');
    if (loginTime) {
      setLoginTimestamp(parseInt(loginTime, 10));
    }
  }, []);

  // 타이머 로직
  useEffect(() => {
    if (loginTimestamp === null) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - loginTimestamp;
      const remaining = Math.max(0, SESSION_DURATION - elapsed);
      setRemainingTime(remaining);

      if (remaining <= 50_000 && !showWarning) {
        setShowWarning(true);
      }

      if (remaining <= 0) {
        clearInterval(interval);
        logout();
        navigate('/auth/login');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTimestamp]);

  // 세션 연장 함수
  const extendSession = () => {
    const now = Date.now();
    localStorage.setItem('auth_login_time', now.toString());
    setLoginTimestamp(now);
    setShowWarning(false);
  };

  return {
    remainingTime,
    showWarning,
    extendSession,
    dismissWarning: () => setShowWarning(false),
  };
};
