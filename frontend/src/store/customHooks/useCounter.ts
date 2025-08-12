// 커스텀 훅 정의
import { useContext } from 'react';
import { CounterContext } from './contexts/CounterContext';

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) throw new Error('useCounter must be used within CounterProvider');
  return context;
};