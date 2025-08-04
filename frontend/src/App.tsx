import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/Register';
import Main from './pages/Main';

import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import TestPage from './pages/TestPage';
import { useSessionStore } from './store/useSessionStore';

const useRestoreAuth = () => {
  const { login } = useAuthStore();
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('auth_user');
    if (token && username) {
      login(token, username);
    }
  }, []);
};


function App() {

  // 초기화 시점에 auth 상태를 복원
  // 커스텀 훅을 사용하여 로그인 상태를 복원
  // useRestoreAuth();
  
  /* zustand store */
  const {
    startTimer,
  } = useSessionStore();

  useEffect(() => {
    startTimer();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/test" element={<TestPage />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
