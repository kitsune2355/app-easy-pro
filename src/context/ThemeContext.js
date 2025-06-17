import React, { createContext, useContext, useState } from "react";
import { extendTheme, NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

const fontConfig = {
  Roboto: {
    400: { normal: "Roboto_400Regular" },
    500: { normal: "Roboto_500Medium" },
    700: { normal: "Roboto_700Bold" },
  },
};

const fonts = {
  heading: "Roboto",
  body: "Roboto",
  mono: "Roboto",
};

// สร้างธีมของ NativeBase
const lightTheme = extendTheme({
  colors: {
    primary: "#006B9F",
    background: "#006B9F",
    card: "#ffffff",
    text: "#333333",
  },
  fontConfig: fontConfig,
  fonts: fonts,
});

const darkTheme = extendTheme({
  colors: {
    primary: "#ffffff",
    background: "#000000",
    card: "#000000",
    text: "#ffffff",
  },
  fontConfig: fontConfig,
  fonts: fonts,
});

// Context
const ThemeContext = createContext({
  colorTheme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const colorTheme = isDark ? darkTheme : lightTheme;

  if (!fontsLoaded) {
    return null; // or a loading component
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, toggleTheme }}>
      <NativeBaseProvider theme={colorTheme}>{children}</NativeBaseProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
