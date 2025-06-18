import { configureStore } from '@reduxjs/toolkit';
import repairReducer from './redux/repairSlice';

const store = configureStore({
  reducer: {
    repair: repairReducer
  }
});

// Export types after store is created
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
