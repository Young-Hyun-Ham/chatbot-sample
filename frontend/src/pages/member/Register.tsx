import { useState } from 'react';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !username) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await register({ email, password, username });
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/auth/login');
    } catch (err) {
      setError('회원가입에 실패했습니다. 이미 존재하는 이메일일 수 있습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">회원가입</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          className="w-full p-2 border rounded mb-2"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="닉네임"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded" onClick={handleRegister}>
          가입하기
        </button>
      </div>
    </div>
  );
};

export default Register;
