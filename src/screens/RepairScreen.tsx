import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import AppHeader from "../components/AppHeader";
import { VStack, Text, Input } from "native-base";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const RepairScreen = () => {
  const {t} = useTranslation();
  const { colorTheme } = useTheme();

  return (
    <>
      <AppHeader
        title={t("MENU.REPAIR_REQ")}
        bgColor={colorTheme.colors.primary}
        textColor={colorTheme.colors.card}
      />
      <VStack
        w="full"
        h="full"
        bg={{
          linearGradient: {
            colors: ["#006B9F", "#00405f"],
            start: [1, 0],
            end: [1, 1],
          },
        }}
      >
        <ScreenWrapper>
          <VStack space={3}>
            <>
              <Text color="white" fontSize="md" fontWeight="bold">
                ข้อมูลการแจ้ง
              </Text>
              <VStack bg={colorTheme.colors.card} borderRadius="3xl" p="5" space={2}>
                <Text>RepairScreen</Text>
                <Input placeholder="name" />
              </VStack>
            </>
          </VStack>
        </ScreenWrapper>
      </VStack>
    </>
  );
};

export default RepairScreen;
