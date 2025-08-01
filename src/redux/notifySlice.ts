import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../interfaces/notify.interface";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../service/notifyService";

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
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<FetchNotificationsResponse>
    ) => {
      // API already returns filtered data, no need to filter again
      state.notifications = action.payload.data;
      state.unreadCount = action.payload.unreadCount;
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
      // Add new notification to the beginning of the list
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
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
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        // Use the data directly from API response
        // API already handles filtering based on user level and permissions
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch notifications";
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(
          (n) => n.id === notificationId
        );
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to mark notification as read";
      });
  },
});

export const {
  setNotifications,
  setLoading,
  setError,
  addNotification,
  markNotificationAsReadInState,
  clearNotifications,
} = notifySlice.actions;

export default notifySlice.reducer;
