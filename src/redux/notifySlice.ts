import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from '../interfaces/notify.interface';

export interface INotifyState {
  notifications: INotification[];
  loading: boolean;
  error: string | null;
}

const initialState: INotifyState = {
  notifications: [],
  loading: false,
  error: null,
};

const notifySlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.unshift(action.payload);
      state.error = null;
    },
    markNotificationAsReadInState: (state, action: PayloadAction<number>) => {
      const notificationIdToMark = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationIdToMark
      );
      if (notification) {
        notification.is_read = true;
      }
    },
  },
});

export const {
  setNotifications,
  setLoading,
  setError,
  addNotification,
  markNotificationAsReadInState,
} = notifySlice.actions;

export default notifySlice.reducer;
