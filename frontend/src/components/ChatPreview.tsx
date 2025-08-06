import { useScenarioStore } from "../store/useScenarioStore";

let mockMessages = [
  { type: 'bot', text: '안녕하세요' },
  { type: 'bot', text: '선박 예약을 시작합니다! :)' },
  { type: 'bot', text: '출발 항구를 입력해주세요!' },
  { type: 'user', text: '부산' },
  { type: 'bot', text: '도착 항구를 입력해주세요!!' },
  { type: 'user', text: '홍콩' },
  { type: 'bot', text: '컨테이너 타입을 선택해주세요.', quickReplies: ['Dry', 'Reefer', '새 답장'] },
];

const ChatPreview = () => {
  const scenarioData = useScenarioStore((state) => state.scenarioData);
  const nodes = useScenarioStore((state) => state.nodes);

  mockMessages = [
    // { type: 'bot', text: JSON.stringify(scenarioData, null, 2) },
    // { type: 'user', text: JSON.stringify(nodes, null, 2) },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 상단 바 */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-white">
        <h2 className="font-bold text-lg">챗봇</h2>
        <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
          다시 시작
        </button>
      </div>

      {/* 본문 영역 */}
      <div className="flex-1 bg-blue-100 flex items-center justify-center">
        {/* 빈 상태이므로 내용 없음 */}
      </div>

      {/* 하단 버튼 */}
      <div className="p-4">
        <button className="w-full py-3 bg-white border rounded-full text-blue-800 font-semibold hover:bg-gray-50">
          대화 다시 시작하기
        </button>
      </div>
    </div>
  );
};

export default ChatPreview;