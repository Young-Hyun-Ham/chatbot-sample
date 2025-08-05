import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/member/Register';
import Main from './pages/Main';
import { CounterProvider } from './store/customHooks/contexts/CounterContext';
import ScenarioDetail from './pages/scenario/ScenarioDetail';

function App() {

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
              {/* 커스텀훅을 사용하기 위해 counter 컴포넌트를 감싸는 CounterProvider를 추가합니다. */}
              <CounterProvider>
                <Main />
              </CounterProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/scenario/:id" element={<ScenarioDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
