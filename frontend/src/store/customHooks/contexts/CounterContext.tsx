// 상태 & Provider 정의
import { createContext, useState, type ReactNode } from 'react';

type CounterContextType = {
  count: number;
  increment: () => void;
  reset: () => void;
};

export const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const reset = () => setCount(0);

  return (
    <CounterContext.Provider value={{ count, increment, reset }}>
      {children}
    </CounterContext.Provider>
  );
};
