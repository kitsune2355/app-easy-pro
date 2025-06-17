import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

function AppContent() {
  const { colorTheme } = useTheme();

  return (
    <SafeAreaProvider>
        <NavigationContainer theme={colorTheme}>
          <StatusBar hidden={true} />
          <DrawerNavigator />
        </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}