import { useEffect, useRef, useState } from 'react';
import ChatBot from '../../components/ChatBot';
import FlowEditor from '../../components/FlowEditor';
import SectionToolbar from '../../components/SectionToolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/axios';
import { useScenarioStore } from '../../store/useScenarioStore';
import { useAuthStore } from '../../store/authStore';
import LogPreview from '../../components/LogPreview';
import SectionOptionsPanel from '../../components/SectionOptionsPanel';

const LOG_WIDTH = 250;
const CHAT_MIN = 240;
const CHAT_MAX = 640;
const CHAT_DEFAULT = 250;
const OPTION_WIDTH = 320; // ★ 옵션창 고정 폭

const ScenarioDetail = () => {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.email);
  const setNodes = useScenarioStore((s) => s.setNodes);
  const setEdges = useScenarioStore((s) => s.setEdges);
  const scenarioData = useScenarioStore((state) => state.scenarioData);
  const setScenarioData = useScenarioStore((state) => state.setScenarioData);
  const { id } = useParams();

  const [isLogVisible, setIsLogVisible] = useState(true);
  const [chatWidth, setChatWidth] = useState<number>(CHAT_DEFAULT);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false); // 드레그 여부 상태 추가
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const [isChatVisible, setIsChatVisible] = useState(true);
  const effectiveChatWidth = isChatVisible ? chatWidth : 0;

  const lastLoadedRef: any = useRef<string | null>(null);

  useEffect(() => {
    // React 18의 <React.StrictMode> 때문에 useEffect가 “의도적으로 두 번” 실행 된다.
    // 마운트 → 이펙트 실행 → 클린업 → 다시 마운트 → 이펙트 재실행 마운트 2번 실행.
    // 한번만 호출 하도록 변경
    if (import.meta.env.DEV && lastLoadedRef.current === id) return;
    lastLoadedRef.current = id;

    const loadScenario = async () => {
      const res = await api.get(`/scenario-detail/${id}`);
      console.log("load  data ==============================> ", res);
      const { nodes, edges } = res.data.data || {};
      setNodes(nodes || []);
      setEdges(edges || []);
      setScenarioData((res.data.data as any) || {});
    };
    loadScenario();
  }, [id]);

  const handleSave = async () => {
    await api.post(`/scenario-detail`, {
      scenario_id: id,
      data: scenarioData,
      create_id: email,
    });
  };

  const logWidth = isLogVisible ? LOG_WIDTH : 0;
  // const flowPanelWidth = `calc(100% - ${chatWidth + logWidth}px)`;
  const flowPanelWidth = `calc(100% - ${effectiveChatWidth + logWidth}px)`;

  // 채팅 리사이저 드래그
  const onChatResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsResizing(true); // ★ 드래그 시작

    const rightEdge = rect.right; // 화면 오른쪽 고정 기준

    const onMove = (ev: MouseEvent) => {
      const w = rightEdge - ev.clientX;
      const clamped = Math.max(CHAT_MIN, Math.min(CHAT_MAX, w));
      setChatWidth(clamped);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setIsResizing(false); // ★ 드래그 종료
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* 전체 Flow 프레임 */}
      <div className="flex h-full border-r" style={{ width: flowPanelWidth }}>
        {/* 1. 좌측 툴바 고정: 150px */}
        <div className="w-[150px] border-r p-4 bg-white">
          <SectionToolbar 
            onList={() => navigate('/')}
            onSave={handleSave}
            onToggleChat={() => setIsChatVisible(v => !v)}
            isChatVisible={isChatVisible}
          />
        </div>

        {/* 2. FlowEditor */}
        <div className="flex-1 h-full border-r">
          <FlowEditor 
            onSelectNode={(id?: string | null) => setSelectedNodeId(id ?? null)}
          />
        </div>
      </div>

      {/* 3. 로그 프리뷰 (채팅 왼쪽에 붙음) */}
      {isLogVisible && (
        <div
          className="absolute top-0 h-full w-[250px] bg-white border-r transition-[right] duration-200"
          style={{ right: effectiveChatWidth }}
        >
          <LogPreview />
        </div>
      )}
      
       {/* ★ 옵션 패널: 로그 왼쪽에, 폭=chatWidth */}
      {selectedNodeId && (
        <SectionOptionsPanel
          nodeId={selectedNodeId}
          width={OPTION_WIDTH} // ★ 고정 폭 전달
          rightOffset={effectiveChatWidth + (isLogVisible ? LOG_WIDTH : 0)}
          isResizing={isResizing}
          onClose={() => setSelectedNodeId(null)}
        />
      )}


      {/* 4. 채팅창 (오른쪽 고정, 가변 폭) */}
      {isChatVisible && (
        <div className="absolute top-0 right-0 h-full bg-blue-100" style={{ width: chatWidth }}>
          <ChatBot />
        </div>
      )}

      {/* ★ 채팅 리사이저: 채팅 왼쪽 경계선 */}
      {isChatVisible && (
        <div
          className="absolute top-0 h-full w-1 z-30 cursor-col-resize"
          style={{ right: chatWidth }}
          onMouseDown={onChatResizeStart}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat panel"
        >
          <div className="w-px h-full bg-gray-300 mx-auto" />
        </div>
      )}

      {/* 토글 버튼: 로그/플로우 경계에 고정 */}
      <div
        className="absolute top-[10%] z-30 transition-[right] duration-200"
        style={{ right: effectiveChatWidth + (isLogVisible ? LOG_WIDTH : 0), transform: 'translateX(50%)' }}
      >
        <button
          onClick={() => setIsLogVisible((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-red-500 hover:bg-gray-100"
        >
          {isLogVisible ? '❯' : '❮'}
        </button>
      </div>

    </div>
  );
};

export default ScenarioDetail;
