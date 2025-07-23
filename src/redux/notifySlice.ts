import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from '../interfaces/notify.interface';
import { fetchNotifications, markNotificationAsRead } from '../service/notifyService';

interface FetchNotificationsResponse {
  data: INotification[];
  unreadCount: number;
}

export interface INotifyState {
  notifications: INotification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: INotifyState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const notifySlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<FetchNotificationsResponse>) => {
      const userId = localStorage.getItem('user_id');

      const filtered = action.payload.data.filter(
        (noti) => noti.created_by !== userId
      );

      state.notifications = filtered;
      state.unreadCount = filtered.filter((n) => !n.is_read).length;
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
      const userId = localStorage.getItem('user_id');

      // ✅ ป้องกันไม่เพิ่ม noti ที่สร้างโดยตัวเอง
      if (action.payload.created_by !== userId) {
        state.notifications.unshift(action.payload);
        if (!action.payload.is_read) {
          state.unreadCount += 1;
        }
      }

      state.error = null;
    },
    markNotificationAsReadInState: (state, action: PayloadAction<number>) => {
      const notificationIdToMark = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationIdToMark
      );
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
      
        const userId = action.payload.userId;
      
        // ✅ กรอง noti ที่ตัวเองสร้าง
        const filtered = action.payload.data.filter(
          (noti) => noti.created_by !== userId
        );
      
        state.notifications = filtered;
        state.unreadCount = filtered.filter((n) => !n.is_read).length;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notificationId = action.meta.arg;
        const notification = state.notifications.find((n) => n.id === notificationId);
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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
