import { configureStore } from '@reduxjs/toolkit';
import repairReducer from './redux/repairSlice';
import authReducer from './redux/authSlice';
import areaReducer from './redux/areaSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    repair: repairReducer,
    area: areaReducer,
  }
});

// Export types after store is created
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
