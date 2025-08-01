import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "../config/environment";
import { AppDispatch } from "../store";
import { markNotificationAsRead } from "../service/notifyService";
import { INotification } from "../interfaces/notify.interface";

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token = null;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const user = userInfoString ? JSON.parse(userInfoString) : null;
      if (user && user.id) {
        await fetch(`${env.API_ENDPOINT}/save_token.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, user_id: user.id }),
        });
        console.log("Expo Push Token:", token, user.id);
      }
    } catch (err) {
      console.error("Error sending token to backend:", err);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

/**
 * Utility function to find notification ID from repair ID
 * @param notifications - Array of notifications
 * @param repairId - The repair ID to find notification for
 * @returns number | null - notification ID if found, null otherwise
 */
export const findNotificationIdByRepairId = (
  notifications: INotification[],
  repairId: string | number
): number | null => {
  const repairIdNum =
    typeof repairId === "string" ? parseInt(repairId, 10) : repairId;

  const notification = notifications.find((n) => n.related_id === repairIdNum);
  return notification ? notification.id : null;
};

/**
 * Utility function to mark notification as read with proper validation
 * @param dispatch - Redux dispatch function
 * @param notificationId - The notification ID to mark as read
 * @returns Promise<boolean> - true if successful, false if failed
 */
export const markNotificationAsReadWithValidation = async (
  dispatch: AppDispatch,
  notificationId: number
): Promise<boolean> => {
  try {
    // Validate notification ID
    if (!notificationId || notificationId <= 0) {
      console.error("Invalid notification ID:", notificationId);
      return false;
    }

    const result = await dispatch(markNotificationAsRead(notificationId));

    // Check if the action was rejected
    if (markNotificationAsRead.rejected.match(result)) {
      console.error("Failed to mark notification as read:", result.payload);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markNotificationAsReadWithValidation:", error);
    return false;
  }
};

/**
 * Utility function to validate notification data
 * @param notification - The notification object to validate
 * @returns boolean - true if valid, false if invalid
 */
export const isValidNotification = (notification: any): boolean => {
  return (
    notification &&
    typeof notification.id === "number" &&
    notification.id > 0 &&
    typeof notification.is_read === "boolean"
  );
};
