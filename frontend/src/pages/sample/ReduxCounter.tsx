import { useAppDispatch, useAppSelector } from '../../store/redux/hooks';
import { increment, decrement, reset } from '../../store/redux/slices/storeSlice';

const ReduxCounter = () => {
  // dispatch는 Redux 스토어에 액션을 전달
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.store.count);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Redux Counter</h2>
      <p>현재 값: {count}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => dispatch(increment())} className="bg-blue-500 text-white px-3 py-1 rounded">+1</button>
        <button onClick={() => dispatch(decrement())} className="bg-blue-500 text-white px-3 py-1 rounded">-1</button>
        <button onClick={() => dispatch(reset())} className="bg-gray-400 text-white px-3 py-1 rounded">Reset</button>
      </div>
    </div>
  );
};

export default ReduxCounter;
