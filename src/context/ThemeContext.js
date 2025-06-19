import React, { createContext, useContext, useState } from "react";
import { extendTheme, NativeBaseProvider } from "native-base";
import {
  useFonts,
  Prompt_400Regular,
  Prompt_500Medium,
  Prompt_700Bold,
} from "@expo-google-fonts/prompt";

import { LinearGradient } from "expo-linear-gradient";

const config = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};

const fontConfig = {
  Prompt: {
    400: { normal: "Prompt_400Regular" },
    500: { normal: "Prompt_500Medium" },
    700: { normal: "Prompt_700Bold" },
  },
};

const fonts = {
  heading: "Prompt",
  body: "Prompt",
  mono: "Prompt",
};

// สร้างธีมของ NativeBase
const lightTheme = extendTheme({
  colors: {
    primary: "#006B9F",
    background: "#f0f0fc",
    card: "#ffffff",
    text: "#333333",
    border: "#e0e0e0",
    notification: "#006B9F",
    secondary: "#9fd7f3",
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
    border: "#333333",
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
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_700Bold,
  });

  const colorTheme = isDark ? darkTheme : lightTheme;

  if (!fontsLoaded) {
    return null; // or a loading component
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, toggleTheme }}>
      <NativeBaseProvider config={config} theme={colorTheme}>
        {children}
      </NativeBaseProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
