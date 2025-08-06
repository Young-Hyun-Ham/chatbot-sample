import { useScenarioStore } from "../store/useScenarioStore";

let mockMessages = [];

const LogPreview = () => {
  const scenarioData = useScenarioStore((state) => state.scenarioData);
  const nodes = useScenarioStore((state) => state.nodes);

  mockMessages = [
    { type: 'bot', text: JSON.stringify(scenarioData, null, 2) },
    { type: 'user', text: JSON.stringify(nodes, null, 2) },
  ];

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-xl font-bold mb-4">Log</h2>
      {mockMessages.map((msg, idx) => (
        <div key={idx} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
          <span className={`text-[10px]`}>{`${msg.type === 'user' ? 'ui json data ' : 'db json data '}`}</span>
          <div
            className={`inline-block px-4 py-2 font-mono rounded-lg text-[8px] ${
              msg.type === 'user'
                ? 'bg-yellow-300 text-black'
                : 'bg-white border text-black'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogPreview;
