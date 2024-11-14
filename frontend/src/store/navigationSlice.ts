import { createSlice } from '@reduxjs/toolkit';

interface NavigationState {
  currentPage: string;
}

const initialState: NavigationState = {
  currentPage: 'home',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setPage } = navigationSlice.actions;
export default navigationSlice.reducer;
