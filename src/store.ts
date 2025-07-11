import { configureStore } from '@reduxjs/toolkit';
import repairReducer from './redux/repairSlice';
import authReducer from './redux/authSlice';
import areaReducer from './redux/areaSlice';
import userReducer from './redux/userSlice';
import notifyReducer from './redux/notifySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    repair: repairReducer,
    area: areaReducer,
    notify: notifyReducer,
  }
});

// Export types after store is created
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
