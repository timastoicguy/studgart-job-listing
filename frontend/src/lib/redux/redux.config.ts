import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index'; // Assume you have reducers combined

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
