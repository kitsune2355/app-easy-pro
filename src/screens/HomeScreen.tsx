import { useTheme } from "@react-navigation/native";
import { VStack, Text } from "native-base";
import React from "react";

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <VStack p="8">
      <Text color={colors.card}>ภาพรวมงานซ่อม</Text>
    </VStack>
  );
};

export default HomeScreen;
