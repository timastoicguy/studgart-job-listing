// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './navigationSlice'; // Đường dẫn tới navigationSlice
import authReducer from './auth/authSlice'; // Đường dẫn tới authSlice

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    auth: authReducer, // Kết hợp authReducer vào store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
