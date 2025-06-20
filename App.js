import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Provider } from 'react-redux';
import store from './src/store'; 
import MainStack from "./src/navigation/MainStack";
import './src/config/il8n'

function AppContent() {
  const { colorTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={colorTheme}>
        <StatusBar hidden={true} />
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
