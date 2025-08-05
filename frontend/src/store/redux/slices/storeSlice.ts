import { createSlice } from '@reduxjs/toolkit';

interface StoreState {
  count: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: StoreState = {
  count: 0,
  status: 'idle',
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
    reset(state) {
      state.count = 0;
      state.status = 'idle';
    },
  },
});

export const {
  increment,
  decrement,
  reset,
} = storeSlice.actions;

export default storeSlice.reducer;
