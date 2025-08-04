import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Register from './pages/Register';
import Main from './pages/Main';

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
  // useRestoreAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
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
