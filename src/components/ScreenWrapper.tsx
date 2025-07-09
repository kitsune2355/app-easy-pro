import { KeyboardAvoidingView, ScrollView, VStack } from "native-base";
import React from "react";
import { Platform } from "react-native";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // ปรับให้เหมาะกับ iOS
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <VStack py="4" px="8" safeAreaBottom>
          {children}
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ScreenWrapper;
