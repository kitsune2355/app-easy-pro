import React, { createContext, useContext, useState } from "react";
import { extendTheme, Input, NativeBaseProvider, TextArea } from "native-base";
import {
  useFonts,
  Prompt_400Regular,
  Prompt_500Medium,
  Prompt_700Bold,
} from "@expo-google-fonts/prompt";

import { LinearGradient } from "expo-linear-gradient";

if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.("SSRProvider is not necessary")) {
      return;
    }
    originalWarn(...args);
  };
}

const config = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
  suppressColorAccessibilityWarning: true,
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
  components: {
    Input: {
      baseStyle: {
        borderRadius: 10,
        backgroundColor: "#ffffff",
        color: "#333333",
        placeholderTextColor: "#9ca3af",
        _focus: {
          borderColor: "#006B9F",
          backgroundColor: "#ffffff",
        },
      },
    },
    TextArea: {
      baseStyle: {
        borderRadius: 10,
        backgroundColor: "#ffffff",
        color: "#333333",
        placeholderTextColor: "#9ca3af",
        _focus: {
          borderColor: "#006B9F",
          backgroundColor: "#ffffff",
        },
      },
    },
    Select: {
      baseStyle: {
        borderRadius: 10,
        backgroundColor: "#ffffff",
        color: "#333333",
        placeholderTextColor: "#9ca3af",
        _focus: {
          borderColor: "#006B9F",
          backgroundColor: "#ffffff",
        },
      },
    }
  },
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
