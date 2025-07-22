import axios from "axios";
import { env } from "../config/environment";
import {
  IFetchNotificationsResponse,
  IMarkReadResponse,
} from "../interfaces/notify.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchNotifications = createAsyncThunk<
  IFetchNotificationsResponse & { userId: string },
  { isRead: boolean | null }
>(
  "notifications/fetchNotifications",
  async ({ isRead }, thunkAPI) => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const user = userInfoString ? JSON.parse(userInfoString) : null;

      if (!user || !user.id) {
        throw new Error("User information not found");
      }

      const url = `${env.API_ENDPOINT}/get_notifications.php?user_id=${user.id}&user_level=${user.role}&is_read=${isRead ? "1" : "0"}`;
      const response = await axios.get<IFetchNotificationsResponse>(url);

      return {
        ...response.data,
        userId: user.id,
      };

    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        unreadCount: 0,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch notifications",
      });
    }
  }
);


export const markNotificationAsRead = createAsyncThunk<
  IMarkReadResponse,
  number
>("notifications/markAsRead", async (notificationId, thunkAPI) => {
  try {
    const response = await axios.post<IMarkReadResponse>(
      `${env.API_ENDPOINT}/mark_notification_as_read.php`,
      { notification_id: notificationId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to mark notification as read",
    });
  }
});