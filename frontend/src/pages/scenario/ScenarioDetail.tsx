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

  const flowPanelWidth = isLogVisible
    ? 'calc(100% - 500px)' // Log + Chat
    : 'calc(100% - 250px)'; // Chat만

  return (
    <div className="relative h-screen overflow-hidden">
      {/* 전체 Flow 프레임 */}
      <div className="flex h-full border-r" style={{ width: flowPanelWidth }}>
        {/* 1. 좌측 툴바 고정: 150px */}
        <div className="w-[150px] border-r p-4 bg-white">
          <SectionToolbar />
        </div>

        {/* 2. FlowEditor: (중앙) */}
        {/* <div className="flex-1 h-full"> */}
        <div className="flex-1 h-full border-r" style={{ width: flowPanelWidth }}>
          <FlowEditor
            onClickList={() => navigate('/')}
            onClickSave={handleSave}
          />
        </div>
      </div>

      {/* 3. 로그 프리뷰 */}
      {isLogVisible && (
        <div className="absolute top-0 right-[250px] h-full w-[250px] bg-white border-r transition-all duration-300">
          <LogPreview />
        </div>
      )}

      {/* 4. 챗봇 */}
      <div className="absolute top-0 right-0 h-full w-[250px] bg-blue-100">
        <ChatPreview />
      </div>

      {/* 토글 버튼 */}
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
    </div>
  );
};

export default ScenarioDetail;
