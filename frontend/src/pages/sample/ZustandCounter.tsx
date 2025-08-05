import { useCounterStore } from '../../store/zustand/useCounterStore';

const ZustandCounter = () => {
  const { count, increment, reset } = useCounterStore();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Redux Counter</h2>
      <p>현재 값: {count}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={increment} className="bg-blue-500 text-white px-3 py-1 rounded">+1</button>
        <button onClick={reset} className="bg-gray-400 text-white px-3 py-1 rounded">Reset</button>
      </div>
    </div>
  );
};

export default ZustandCounter;