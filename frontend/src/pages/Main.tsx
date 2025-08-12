import Chat from './sample/Chat';
import { useSessionStore } from '../store/useSessionStore';
import { useEffect, useState } from 'react';
import ZustandCounter from './sample/ZustandCounter';
import ReduxCounter from './sample/ReduxCounter';
import CustomCounter from './sample/CustomCounter';
import Todos from './todo/Todos';
import Scenario from './scenario/Scenario';

const Main = () => {
  const [pagename, setPageName] = useState('scenario'); // 초기 페이지 이름 설정

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

  function handleClick(pagename: string) {
    if (pagename === 'zustand') { // 사용안함.
      setPageName('zustand');
    } else if (pagename === 'redux') { // 사용안함.
      setPageName('redux');
    } else if (pagename === 'custom') { // 사용안함.
      setPageName('custom');
    } else if (pagename === 'todos') {
      setPageName('todos');
    } else if (pagename === 'scenario') {
      setPageName('scenario');
    } else {
      setPageName('scenario');
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-100 p-4 text-center text-sm h-[10%] flex items-center justify-center shadow">
        &nbsp;|&nbsp;
        <span style={{cursor: 'pointer'}} onClick={() => {handleClick('scenario')}}>Scenario</span>
        &nbsp;|&nbsp;
        <span style={{cursor: 'pointer'}} onClick={() => {handleClick('todos')}}>Todos</span>
        {/*
        &nbsp;|&nbsp;
        <span style={{cursor: 'pointer'}} onClick={() => {handleClick('zustand')}}>Zustand</span>
        &nbsp;|&nbsp;
        <span style={{cursor: 'pointer'}} onClick={() => {handleClick('redux')}}>Redux</span>
        &nbsp;|&nbsp;
        <span style={{cursor: 'pointer'}} onClick={() => {handleClick('custom')}}>Custom Hooks</span> 
        */}
        &nbsp;|&nbsp;
        세션 남은 시간: <span className="font-bold ml-2">{formatTime(remainingTime)}</span>
        <button
          onClick={extendSession}
          className="text-white px-3 py-1 rounded text-sm"
        >
          🔄
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
            로그아웃
        </button>
      </header>
      <main className="flex-1 overflow-auto h-[90%]">
        {(() => {
          switch (pagename) {
            case 'chat':
              return <Chat />;
            case 'scenario':
              return <Scenario />;
            case 'todos':
              return <Todos />;
            case 'custom':
              return <CustomCounter />;
            case 'redux':
              return <ReduxCounter />;
            case 'zustand':
              return <ZustandCounter />;
            default:
              return <div className="p-4 text-gray-500">페이지를 찾을 수 없습니다.</div>;
          }
        })()}
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
