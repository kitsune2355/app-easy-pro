import React, { createContext, useContext, useState, useEffect } from "react";
import { extendTheme, NativeBaseProvider } from "native-base";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const lightTheme = extendTheme({
  colors: {
    main: "#006B9F",
    primary: "#006B9F",
    background: "#f0f0fc",
    card: "#ffffff",
    text: "#333333",
    border: "#e0e0e0",
    notification: "#90CAF9",
    secondary: "#9fd7f3",
    dark: "#194066",
    darkLight: "#006B9F",
    success: "#28a745",
    switch: "#9fd7f3",
    drawer: "#006B9F",
  },
  fontConfig,
  fonts,
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
    },
  },
});

const darkTheme = extendTheme({
  colors: {
    main: "#006B9F",
    primary: "#ffffff",
    background: "#121212",
    card: "#1E1E1E",
    text: "#ffffff",
    border: "#444444",
    notification: "#90CAF9",
    secondary: "#444444",
    dark: "#000",
    darkLight: "#444444",
    success: "#28a745",
    switch: "#90CAF9",
    drawer: "#000",
  },
  fontConfig,
  fonts,
  components: {
    Input: {
      baseStyle: {
        borderRadius: 10,
        backgroundColor: "#2C2C2C",
        color: "#ffffff",
        placeholderTextColor: "#BBBBBB",
        _focus: {
          borderColor: "#90CAF9",
          backgroundColor: "#2C2C2C",
        },
      },
    },
    TextArea: {
      baseStyle: {
        borderRadius: 10,
        backgroundColor: "#2C2C2C",
        color: "#ffffff",
        placeholderTextColor: "#BBBBBB",
        _focus: {
          borderColor: "#90CAF9",
          backgroundColor: "#2C2C2C",
        },
      },
    },
    Select: {
      baseStyle: {
        borderRadius: 10,
        backgroundColor: "#2C2C2C",
        color: "#ffffff",
        placeholderTextColor: "#BBBBBB",
        _focus: {
          borderColor: "#90CAF9",
          backgroundColor: "#2C2C2C",
        },
      },
      _selectedItem: {
        bg: "#3A3A3A",
        _text: {
          color: "#ffffff",
        },
      },
      _actionSheetContent: {
        backgroundColor: "#1E1E1E",
      },
      _item: {
        _text: {
          color: "#ffffff",
        },
        _pressed: {
          bg: "#3A3A3A",
        },
      },
    },
  },
});

const ThemeContext = createContext({
  colorTheme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [fontsLoaded] = useFonts({
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_700Bold,
  });

  // โหลดค่าธีมที่เลือกไว้จาก AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const value = await AsyncStorage.getItem("@theme_mode");
        if (value === "dark") {
          setIsDark(true);
        }
      } catch (e) {
        console.warn("Failed to load theme from storage", e);
      }
    };
    loadTheme();
  }, []);

  // สลับธีมและบันทึกไว้ใน AsyncStorage
  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem("@theme_mode", newTheme ? "dark" : "light");
    } catch (e) {
      console.warn("Failed to save theme to storage", e);
    }
  };

  const colorTheme = isDark ? darkTheme : lightTheme;

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
        <ActivityIndicator size="large" color="#006B9F" />
        <Text style={{ marginTop: 10 }}>กำลังโหลด...</Text>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, toggleTheme }}>
      <NativeBaseProvider config={config} theme={colorTheme}>
        {children}
      </NativeBaseProvider>
    </ThemeContext.Provider>
  );
};

// ใช้ใน component เพื่อเข้าถึงธีม
export const useTheme = () => useContext(ThemeContext);
