import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  requestCount: number; 
}

const initialState: LoadingState = {
  isLoading: false,
  requestCount: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.requestCount += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.requestCount = Math.max(state.requestCount - 1, 0);
      if (state.requestCount === 0) {
        state.isLoading = false;
      }
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;