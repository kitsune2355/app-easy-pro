import { Text } from "react-native";
import React from "react";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import ScreenWrapper from "../components/ScreenWrapper";

const RepairSubmitScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  return (
    <>
      <AppHeader
        title={t("MENU.SUBMIT_REPAIR_REQ")}
        bgColor={colorTheme.colors.primary}
        textColor="white"
      />
      <ScreenWrapper>
        <Text>RepairSubmitScreen</Text>
      </ScreenWrapper>
    </>
  );
};

export default RepairSubmitScreen;
