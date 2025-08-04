import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const SESSION_DURATION = 1 * 60 * 1000; // 1분

export const useSessionTimer = () => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loginTimestamp, setLoginTimestamp] = useState<number | null>(null);
  const loginTimestampRef = useRef<number | null>(null);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 로그인 시간 불러오기 (초기 1회)
  useEffect(() => {
    const loginTime = localStorage.getItem('auth_login_time');
    if (loginTime) {
      setLoginTimestamp(parseInt(loginTime, 10));
      loginTimestampRef.current = parseInt(loginTime, 10);
    }
  }, []);

  // 타이머 로직
  useEffect(() => {
    if (loginTimestamp === null) return;

    const interval = setInterval(() => {
      const currentLoginTimestamp = loginTimestampRef.current;
      if (currentLoginTimestamp === null) return;

      const elapsed = Date.now() - currentLoginTimestamp;
      const remaining = Math.max(0, SESSION_DURATION - elapsed);
      setRemainingTime(remaining);

      if (remaining <= 50_000 && remaining > 0 && !showWarning && !dismissed) {
        setShowWarning(true);
      }

      if (remaining <= 0) {
        clearInterval(interval);
        logout();
        navigate('/auth/login');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTimestamp, dismissed]);

  // 세션 연장 함수
  const extendSession = () => {
    const now = Date.now();
    localStorage.setItem('auth_login_time', now.toString());
    setLoginTimestamp(now);
    loginTimestampRef.current = now; // 최신 로그인 시간 업데이트
    setShowWarning(false);
    setDismissed(false);
  };

  // 경고 모달 닫기 함수
  const dismissWarning = () => {
    setShowWarning(false);
    setDismissed(true); // 닫기 누르면 dismissed → true
  };

  return {
    remainingTime,
    showWarning,
    extendSession,
    dismissWarning,
  };
};