import Chat from './Chat';
import { useSessionStore } from '../store/useSessionStore'; // zustand store
import { useEffect } from 'react';

const Main = () => {

  /* zustand store */
  const {
    remainingTime,
    showWarning,
    extendSession,
    dismissWarning,
    startTimer,
  } = useSessionStore();

  useEffect(() => {
    startTimer();
  }, []);

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const remainSec = sec % 60;
    return `${min}분 ${remainSec}초`;
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-100 p-4 text-center text-sm h-[10%] flex items-center justify-center shadow">
        세션 남은 시간: <span className="font-bold ml-2">{formatTime(remainingTime)}</span>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/auth/login';
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
            로그아웃
        </button>
      </header>
      <main className="flex-1 overflow-auto h-[90%]">
        <Chat />
      </main>
    
      {/* 경고 모달 */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-2 text-red-600">⚠️ 세션 만료 경고</h2>
            <p className="text-gray-700 mb-4">세션이 곧 만료됩니다.<br />50초 이내로 자동 로그아웃됩니다.</p>
            <div className="flex justify-center gap-4">
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={extendSession}
                >
                계속 사용
                </button>
                <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={dismissWarning}
                >
                닫기
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default Main;
