import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import store from "./src/store";
import MainStack from "./src/navigation/MainStack";
import "./src/config/il8n";
import { LoadingProvider } from "./src/context/LoadingContext";
import { navigationRef } from "./src/utils/NavigationService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

// ✅ เพิ่ม Handler นี้เพื่อให้แสดง Notification ตอนแอปเปิดอยู่
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function AppContent() {
  const { colorTheme } = useTheme();
  const isDark = colorTheme.colors.background === "#121212";

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={colorTheme} ref={navigationRef}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? 'light-content' : 'dark-content'} />
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
