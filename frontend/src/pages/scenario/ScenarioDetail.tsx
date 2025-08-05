import { useEffect } from 'react';
import ChatPreview from '../../components/ChatPreview';
import FlowEditor from '../../components/FlowEditor';
import SectionToolbar from '../../components/SectionToolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/axios';
import { useScenarioStore } from '../../store/useScenarioStore';
import { useAuthStore } from '../../store/authStore';

const ScenarioDetail = () => {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.email);
  const { setNodes, setEdges } = useScenarioStore();
  const scenarioData = useScenarioStore((state) => state.scenarioData);
  
  const { id } = useParams(); // 시나리오 ID 파라미터

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
      create_id: email
    });
  };

  return (
    <div className="flex h-screen">
      {/* 좌측 전체 */}
      <div className="w-2/3 flex flex-col border-r">
        {/* 상단 바 (목록, 저장 버튼) */}
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

        {/* SectionToolbar + FlowEditor */}
        <div className="flex flex-1 relative">
          {/* 좌측 상단 툴바 고정 */}
          <div className="absolute top-4 left-4 z-10">
            <SectionToolbar />
          </div>

          {/* React Flow 에디터 */}
          <div className="w-full h-full">
            <FlowEditor />
          </div>
        </div>
      </div>

      {/* 우측: 채팅 프리뷰 */}
      <div className="w-1/3 bg-gray-100">
        <ChatPreview />
      </div>
    </div>
  );
};

export default ScenarioDetail;
