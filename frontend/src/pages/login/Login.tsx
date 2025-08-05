import { useEffect, useState } from 'react';
import { axiosLogin } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main'); // 이미 로그인된 상태라면 메인으로
    }
  }, [isAuthenticated]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Zustand store에서 로그인 함수 가져오기
  const {login} = useAuthStore();

  const handleLogin = async () => {
    try {
      const res = await axiosLogin({ email, password }); // axios를 사용한 로그인 API 호출
      login(res.token, res.email, res.username);
      navigate('/main');
    } catch (err) {
      setError('로그인 실패');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          className="w-full p-2 border rounded mb-2"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded" onClick={handleLogin}>
          로그인
        </button>
        <button
          className="w-full mt-4 border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-100"
          onClick={() => navigate('/auth/register')}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
