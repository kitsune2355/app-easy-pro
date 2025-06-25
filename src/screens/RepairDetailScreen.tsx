import React from "react";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const RepairDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  return (
    <>
      <AppHeader
        title={t("MENU.REPAIR_DESC")}
        bgColor={colorTheme.colors.card}
      />
    </>
  );
};

export default RepairDetailScreen;
