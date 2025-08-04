import { useEffect } from 'react';
import { useSessionTimer } from '../hooks/useSessionTimer'; // 커스텀 훅
import { useSessionStore } from '../store/useSessionStore'; // zustand store

const formatTime = (ms: number) => {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const remainSec = sec % 60;
  return `${min}분 ${remainSec}초`;
};

const TestPage = () => {
  // 커스텀 훅 상태
  const {
    remainingTime: hookRemaining,
    showWarning: hookWarning,
    dismissed: hookDismissed,
  } = useSessionTimer();

  // zustand 상태
  const {
    remainingTime: storeRemaining,
    showWarning: storeWarning,
    dismissed: storeDismissed,
  } = useSessionStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">세션 상태 확인 페이지</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* 커스텀 훅 상태 */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">🌀 커스텀 훅 상태</h2>
          <p>⏳ 남은 시간: <strong>{formatTime(hookRemaining)}</strong></p>
          <p>⚠️ showWarning: <strong>{hookWarning.toString()}</strong></p>
          <p>🙈 dismissed: <strong>{hookDismissed.toString()}</strong></p>
        </div>

        {/* zustand 상태 */}
        <div className="border p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-green-600">🗃️ Zustand 상태</h2>
          <p>⏳ 남은 시간: <strong>{formatTime(storeRemaining)}</strong></p>
          <p>⚠️ showWarning: <strong>{storeWarning.toString()}</strong></p>
          <p>🙈 dismissed: <strong>{storeDismissed.toString()}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
