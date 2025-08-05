import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CounterState {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>()(
  immer((set) => ({
    count: 0,
    // increment: () => set((state) => ({ count: state.count + 1 })),
    increment: () => set((state) => {
      state.count += 1;
    }),
    reset: () => set({ count: 0}),
  }))
);
