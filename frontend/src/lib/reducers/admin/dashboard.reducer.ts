import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  error: string | null;
  message: string | null;
  totalAccepted: number;
  totalDeclined: number;
  totalWaiting: number;
  totalStaff: number;
  totalProjects: number;
}

const initialState: DashboardState = {
  error: null,
  message: null,
  totalAccepted: 0,
  totalDeclined: 0,
  totalWaiting: 0,
  totalStaff: 0,
  totalProjects: 0,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setMessage(state, action: PayloadAction<string | null>) {
      state.message = action.payload;
    },
    setDashboardData(state, action: PayloadAction<Partial<DashboardState>>) {
      Object.assign(state, action.payload);
    },
    clearMessages(state) {
      state.error = null;
      state.message = null;
    },
  },
});

export const { setError, setMessage, setDashboardData, clearMessages } = dashboardSlice.actions;
export default dashboardSlice.reducer;
