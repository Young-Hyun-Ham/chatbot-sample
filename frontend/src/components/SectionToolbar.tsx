import { useScenarioStore } from '../store/useScenarioStore';

const SectionToolbar = () => {
  const addNode = useScenarioStore((state) => state.addNode);

  return (
    <div className="flex flex-col space-y-3">
      <button
        className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
        onClick={() => addNode('text')}
      >
        + Text
      </button>
      <button
        className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
        onClick={() => addNode('slotFilling')}
      >
        + Slot Filling
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => addNode('condition')}
      >
        + Condition
      </button>
    </div>
  );
};

export default SectionToolbar;
