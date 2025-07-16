import { KeyboardAvoidingView, ScrollView, VStack } from "native-base";
import React from "react";
import { Platform, RefreshControl } from "react-native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  onRefresh?: () => void;        
  refreshing?: boolean;           
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  onRefresh,
  refreshing = false,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <VStack p="4" safeAreaBottom>
          {children}
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ScreenWrapper;
