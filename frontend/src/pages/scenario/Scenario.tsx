import { useEffect, useState } from 'react';
import { createScenario, deleteScenario, getScenarioList, updateScenario } from '../../api/scenarioApi';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

type scenario_data = {
  title?: string;
  description?: string;
  [key: string]: any;
};

type Scenario = {
  id: string;
  scenario_data: scenario_data;
  create_id?: string;
  create_date?: string;
};

const ScenarioList = () => {
  const navigate = useNavigate();

  const email = useAuthStore((state) => state.email);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newScenario, setNewScenario] = useState<scenario_data>({
    title: '',
    description: '',
  });

  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [editingScenarioData, setEditingScenarioData] = useState<scenario_data>({
    title: '',
    description: '',
  });

  const loadScenario = async () => {
    try {
      const data = await getScenarioList();
      setScenarios(data);
    } catch (err) {
      console.error('시나리오 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    loadScenario();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewScenario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정 버튼 클릭 시 해당 시나리오의 데이터를 입력 필드에 채워줍니다.
  const handleEditClick = (scenario: Scenario) => {
    setEditingScenarioId(scenario.id);
    setEditingScenarioData({ ...scenario.scenario_data });
  };

  // 수정 완료 후 저장 버튼 클릭 시
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingScenarioData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정 완료 후 저장 버튼 클릭 시
  const handleEditSave = async () => {
    if (!editingScenarioId || !email) return;
    try {
      await updateScenario(editingScenarioId, editingScenarioData, email);
      await loadScenario();
      setEditingScenarioId(null);
    } catch (err) {
      console.error('시나리오 수정 실패:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingScenarioId(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewScenario({ title: '', description: '' });
  };

  const handleSave = async () => {
    if (!email) {
      throw new Error('로그인 정보가 없습니다.');
    }
    
    try {
      await createScenario(newScenario, email);
      await loadScenario(); // 저장 후 목록 새로고침
      setIsCreating(false);
      setNewScenario({ title: '', description: '' });
    } catch (err) {
      console.error('시나리오 저장 실패:', err);
    }
  };

  // 삭제 버튼 클릭 시
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteScenario(id);
      await loadScenario(); // 목록 새로고침
    } catch (err) {
      console.error('시나리오 삭제 실패:', err);
    }
  };

  // 상세화면 이동
  const handleSelectScenario = (id: string) => {
    navigate(`/scenario/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-10">챗봇 시나리오 목록</h1>

      <div className="w-full max-w-md space-y-4">
        {scenarios.map((s) => (
          <div
            key={s.id}
            onClick={() => handleSelectScenario(s.id)}
            className="bg-white px-4 py-3 rounded border space-y-2"
          >
            {editingScenarioId === s.id ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={editingScenarioData.title}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  name="description"
                  value={editingScenarioData.description}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleEditSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">
                    {s.scenario_data?.title || '(제목 없음)'}
                  </p>
                  {s.scenario_data?.description && (
                    <p className="text-sm text-gray-500">{s.scenario_data.description}</p>
                  )}
                </div>
                
                {/* 수정, 삭제 버튼 */}
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditClick(s)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 border border-red-300 rounded hover:bg-red-200"
                  >
                    삭제
                  </button>
                </div>

              </div>
            )}
          </div>
        ))}

        {isCreating && (
          <div className="bg-gray-50 p-4 border rounded space-y-3">
            <input
              type="text"
              name="title"
              value={newScenario.title}
              onChange={handleInputChange}
              placeholder="시나리오 제목"
              className="w-full px-3 py-2 border rounded"
            />
            <textarea
              name="description"
              value={newScenario.description}
              onChange={handleInputChange}
              placeholder="시나리오 설명"
              className="w-full px-3 py-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>

      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="mt-10 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          + 새 시나리오 추가
        </button>
      )}
    </div>
  );
};

export default ScenarioList;
