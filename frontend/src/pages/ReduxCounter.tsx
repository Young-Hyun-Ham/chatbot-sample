import { useSelector, useDispatch } from 'react-redux';
import { increment, reset } from '../store/redux/counterSlice';
import type { RootState } from '../store/redux/store';

const ReduxCounter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Redux Counter</h2>
      <p>현재 값: {count}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => dispatch(increment())} className="bg-blue-500 text-white px-3 py-1 rounded">+1</button>
        <button onClick={() => dispatch(reset())} className="bg-gray-400 text-white px-3 py-1 rounded">Reset</button>
      </div>
    </div>
  );
};

export default ReduxCounter;
