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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function AppContent() {
  const { colorTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={colorTheme}
        ref={navigationRef}
      >
        <StatusBar hidden={true} />
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

