import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "../config/environment";
import { AppDispatch } from "../store";
import { markNotificationAsRead } from "../service/notifyService";
import { INotification } from "../interfaces/notify.interface";
import { navigationRef, navigate } from "./NavigationService";
import store from "../store";

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

/**
 * Notification Handler สำหรับจัดการการคลิกแจ้งเตือน
 * จะทำงานเมื่อแอปเปิดอยู่ (foreground หรือ background)
 */
export const setupNotificationHandler = () => {
  // Handler สำหรับเมื่อแอปเปิดอยู่ (foreground)
  const foregroundHandler = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("📱 Notification received in foreground:", notification);
    }
  );

  // Handler สำหรับเมื่อคลิกแจ้งเตือน
  const responseHandler = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("👆 Notification clicked:", response);

      const data = response.notification.request.content.data;
      console.log("📋 Notification data:", data);

      // ตรวจสอบว่ามีข้อมูล screen และ params หรือไม่
      if (data && data.screen) {
        handleNotificationNavigation(data);
      }
    }
  );

  return () => {
    foregroundHandler.remove();
    responseHandler.remove();
  };
};

/**
 * จัดการการนำทางตามข้อมูลจาก notification
 */
const handleNotificationNavigation = (data: any) => {
  try {
    const { screen, params } = data;

    // ตรวจสอบว่า navigationRef พร้อมใช้งานหรือไม่
    if (!navigationRef.isReady()) {
      console.log("⏳ Navigation not ready, retrying in 1 second...");
      setTimeout(() => handleNotificationNavigation(data), 1000);
      return;
    }

    // นำทางไปยัง screen ที่ต้องการ
    switch (screen) {
      case "RepairDetailScreen":
        if (params && params.repairId) {
          console.log(
            "🔧 Navigating to RepairDetailScreen with repairId:",
            params.repairId
          );
          navigate("RepairDetailScreen", {
            repairId: params.repairId.toString(),
            notificationId: params.notificationId || undefined,
          });

          // Mark notification as read if notificationId is provided
          if (params.notificationId) {
            // ใช้ setTimeout เพื่อให้การนำทางเสร็จสิ้นก่อน
            setTimeout(() => {
              markNotificationAsReadWithValidation(
                store.dispatch,
                params.notificationId
              );
            }, 1000);
          }
        }
        break;

      case "NotificationScreen":
        console.log("🔔 Navigating to NotificationScreen");
        navigate("NotificationScreen");
        break;

      case "RepairHistoryScreen":
        console.log("📋 Navigating to RepairHistoryScreen");
        navigate("RepairHistoryScreen", { statusKey: "all" });
        break;

      default:
        console.log("❓ Unknown screen:", screen);
        break;
    }
  } catch (error) {
    console.error("❌ Error handling notification navigation:", error);
  }
};
