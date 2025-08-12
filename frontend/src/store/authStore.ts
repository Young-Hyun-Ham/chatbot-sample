import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, email: string, username: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      username: null,
      isAuthenticated: false,

      login: (token, email, username) => {
        const now = Date.now();
        localStorage.setItem('auth_login_time', now.toString());

        set({ token, email, username, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('auth_login_time');
        set({ token: null, email: null, username: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름: auth-storage
      partialize: (state) => ({
        token: state.token,
        email: state.email,
        username: state.username,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
