import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from '../../reducers/admin/dashboard.reducer';  // Example reducer

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  // Add other reducers here
});

export default rootReducer;
