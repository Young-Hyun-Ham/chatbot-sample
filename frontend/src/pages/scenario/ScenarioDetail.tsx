import { useEffect, useState } from 'react';
import ChatPreview from '../../components/ChatPreview';
import FlowEditor from '../../components/FlowEditor';
import SectionToolbar from '../../components/SectionToolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/axios';
import { useScenarioStore } from '../../store/useScenarioStore';
import { useAuthStore } from '../../store/authStore';
import LogPreview from '../../components/LogPreview';

const ScenarioDetail = () => {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.email);
  const { setNodes, setEdges } = useScenarioStore();
  const scenarioData = useScenarioStore((state) => state.scenarioData);
  const { id } = useParams();

  const [isLogVisible, setIsLogVisible] = useState(true);

  useEffect(() => {
    const loadScenario = async () => {
      const res = await api.get(`/scenario/${id}`);
      const { nodes, edges } = res.data.scenario_data || {};
      setNodes(nodes || []);
      setEdges(edges || []);
    };

    loadScenario();
  }, [id, setNodes, setEdges]);

  const handleSave = async () => {
    await api.post(`/scenario_detail`, {
      scenario_id: id,
      data: scenarioData,
      create_id: email,
    });
  };

  // Flow 영역 너비: Log 열림 여부에 따라 가변
  const flowPanelWidth = isLogVisible
    ? 'calc(100% - 500px)' // Chat 250px + Log 250px
    : 'calc(100% - 250px)'; // Chat만 있음

  return (
    <div className="relative h-screen overflow-hidden">
      {/* 1. 가운데 Flow 프레임 */}
      <div
        className="flex flex-col border-r transition-all duration-300"
        style={{ width: flowPanelWidth }}
      >
        {/* 상단 바 */}
        <div className="flex justify-end items-center px-6 py-4 border-b bg-white">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mr-2"
          >
            목록
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            저장
          </button>
        </div>

        {/* 버튼 + FlowEditor */}
        <div className="flex flex-1">
          {/* 버튼 패널 (15%) */}
          <div className="w-[15%] p-4 border-r bg-white">
            <SectionToolbar />
          </div>

          {/* FlowEditor (85%) */}
          <div className="w-[85%]">
            <FlowEditor />
          </div>
        </div>
      </div>

      {/* 2. 로그 화면: Chat 왼쪽에 고정 */}
      {isLogVisible && (
        <div className="absolute top-0 right-[250px] h-full w-[250px] bg-white border-r transition-all duration-300">
          <LogPreview />
        </div>
      )}

      {/* 3. 토글 버튼: 항상 Chat 왼쪽 중앙에 고정 */}
      <div
        className="absolute top-[10%] z-30 transition-all duration-300"
        style={{ right: '250px', transform: 'translateX(50%)' }}
      >
        <button
          onClick={() => setIsLogVisible((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-red-500 hover:bg-gray-100 transition"
        >
          {isLogVisible ? '❯' : '❮'}
        </button>
      </div>

      {/* 4. 챗봇 화면: 우측에 항상 고정 */}
      <div className="absolute top-0 right-0 h-full w-[250px] bg-blue-100">
        <ChatPreview />
      </div>
    </div>
  );
};

export default ScenarioDetail;
