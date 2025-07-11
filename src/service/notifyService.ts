import axios from "axios";
import { env } from "../config/environment"; 
import { IFetchNotificationsResponse, IMarkReadResponse } from "../interfaces/notify.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchNotifications = async (params: {
  isRead: boolean | null;
}): Promise<IFetchNotificationsResponse> => {
  try {
    const userInfoString = await AsyncStorage.getItem("userInfo");
      const user = userInfoString ? JSON.parse(userInfoString) : null;

      if (!user || !user.id) {
        throw new Error("User information not found");
      }
      
    let url = `${env.API_ENDPOINT}/get_notifications.php?`;
    const queryParams: string[] = [];

    if (user.role !== 'admin' && user.id !== null) {
      queryParams.push(`id=${user.id}`);
    }
    if (user.role !== null && user.role !== '') {
      queryParams.push(`user_level=${user.role}`);
    }
    if (params.isRead !== null) {
      queryParams.push(`is_read=${params.isRead ? '1' : '0'}`);
    }

    url += queryParams.join('&');

    const response = await axios.get<IFetchNotificationsResponse>(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message || "Failed to fetch notifications",
    };
  }
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<IMarkReadResponse> => {
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
    console.error(`Error marking notification ${notificationId} as read:`, error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to mark notification as read",
    };
  }
};
