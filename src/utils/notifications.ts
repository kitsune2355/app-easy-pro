import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { env } from "../config/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token = null;
  const userInfoString = await AsyncStorage.getItem("userInfo");
  const user = userInfoString ? JSON.parse(userInfoString) : null;

  if (!user || !user.id) {
    throw new Error("User information not found");
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token permission!");
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (token) {
      await fetch(`${env.API_ENDPOINT}/save_token.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, user_id: user.id }),
      });
    }
    console.log("Expo Push Token:", token, user.id);
  } else {
    console.log("Must use physical device for Push Notifications");
    // Override หรือ mock ค่าของ Device.isDevice
    Object.defineProperty(Device, "isDevice", {
      value: true, // หรือ false ตามต้องการ
      writable: true, // ทำให้มันสามารถเปลี่ยนค่าได้
    });
  }

  // Android specific
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return token;
}
