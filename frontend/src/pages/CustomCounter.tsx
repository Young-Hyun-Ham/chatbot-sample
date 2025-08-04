import { useCounter } from '../store/customHooks/useCounter';

const CustomCounter = () => {
  const { count, increment, reset } = useCounter();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Custom Hook Counter</h2>
      <p className="mb-2">현재 값: <span className="font-semibold">{count}</span></p>
      <button onClick={increment} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">+1</button>
      <button onClick={reset} className="bg-gray-400 text-white px-3 py-1 rounded">Reset</button>
    </div>
  );
};

export default CustomCounter;
