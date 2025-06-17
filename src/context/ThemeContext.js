import React, { createContext, useContext, useState } from "react";
import { DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { extendTheme, NativeBaseProvider } from "native-base";

// สร้างธีมของ NativeBase
const lightTheme = extendTheme({
  colors: {
    primary: "#006B9F",
    background: "#006B9F",
    card: "#ffffff",
    text: "#333333",
  },
});

const darkTheme = extendTheme({
  colors: {
    primary: "#ffffff",
    background: "#000000",
    card: "#000000",
    text: "#ffffff",
  },
});

// Context
const ThemeContext = createContext({
  colorTheme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  const colorTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ colorTheme, toggleTheme }}>
      <NativeBaseProvider theme={colorTheme}>{children}</NativeBaseProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
