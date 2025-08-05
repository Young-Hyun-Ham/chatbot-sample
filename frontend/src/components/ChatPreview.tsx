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

  mockMessages = [
    { type: 'bot', text: JSON.stringify(scenarioData, null, 2) },
  ];
  
  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-xl font-bold mb-4">챗봇</h2>
      {mockMessages.map((msg, idx) => (
        <div key={idx} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
          <div
            className={`inline-block px-4 py-2 rounded-lg ${
              msg.type === 'user'
                ? 'bg-yellow-300 text-black'
                : 'bg-white border text-black'
            }`}
          >
            {msg.text}
          </div>
          {msg.quickReplies && (
            <div className="flex mt-2 space-x-2">
              {msg.quickReplies.map((qr, i) => (
                <button
                  key={i}
                  className="px-3 py-1 border border-gray-400 rounded text-sm"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatPreview;
