import { configureStore } from '@reduxjs/toolkit';
import storeReducer from './slices/storeSlice';

// Redux 스토어 인스턴스
export const store = configureStore({
  reducer: {
    store: storeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
