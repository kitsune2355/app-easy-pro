import { ScrollView, VStack } from "native-base";
import React from "react";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack py="4" px="8">
        {children}
      </VStack>
    </ScrollView>
  );
};

export default ScreenWrapper;
