import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import challengeReducer from './slices/challengeSlice';
import loadingReducer from './slices/loadingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    challenges: challengeReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;