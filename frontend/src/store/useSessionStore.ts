import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { SESSION_EXTENSION_PROMPT_TIME, SESSION_TIME } from '../config/session';

const SESSION_DURATION = SESSION_TIME * 60 * 1000; // 실제는 SESSION_TIME 분

type SessionState = {
  remainingTime: number;
  showWarning: boolean;
  loginTimestamp: number | null;
  dismissed: boolean;
  startTimer: () => void;
  extendSession: () => void;
  dismissWarning: () => void;
};

export const useSessionStore = create<SessionState>()((set, get) => {
  let interval: NodeJS.Timeout | null = null;
  const logout = useAuthStore.getState().logout;

  const navigate = (path: string) => {
    // NOTE: zustand 내부에서는 hook 사용 불가 → window.location 사용
    window.location.href = path;
  };

  return {
    remainingTime: 0,
    showWarning: false,
    loginTimestamp: null,
    dismissed: false,

    startTimer: () => {
      const loginTime = localStorage.getItem('auth_login_time');
      if (!loginTime) return;

      const loginTimestamp = parseInt(loginTime, 10);
      set({ loginTimestamp });

      if (interval) clearInterval(interval);

      interval = setInterval(() => {
        const currentLoginTimestamp = get().loginTimestamp ?? loginTimestamp; // 항상 최신 값
        const elapsed = Date.now() - currentLoginTimestamp;
        const remaining = Math.max(0, SESSION_DURATION - elapsed);

        // showWarning은 단발성으로만 켜지도록
        if (remaining <= SESSION_EXTENSION_PROMPT_TIME && remaining > 0 && !get().showWarning && !get().dismissed) {
          set({ showWarning: true });
        }

        if (remaining <= 0) {
          if (interval) clearInterval(interval);
          logout();
          navigate('/auth/login');
        }

        set({ remainingTime: remaining });
      }, 1000);
    },

    extendSession: () => {
      const now = Date.now();
      localStorage.setItem('auth_login_time', now.toString());
      set({
          loginTimestamp: now,
          showWarning: false,
          remainingTime: SESSION_DURATION, // 즉시 반영
          dismissed: false, // 연장 시 dismiss 상태 초기화
      });
    },

    dismissWarning: () => {
      set({ showWarning: false });
      set({ showWarning: false, dismissed: true });
    },
  };
});
