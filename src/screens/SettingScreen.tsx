import { VStack, Text, HStack, Switch, Spacer } from "native-base";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n from "../config/il8n";
import { LanguageButtonGroup } from "../components/LanguageButtonGroup";

const SettingScreen: React.FC = () => {
  const { colorTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <VStack flexGrow={1} bg={colorTheme.colors.card} p={4} rounded="md">
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={colorTheme.colors.text}
        mb={6}
      >
        {t("SCREENS.SETTINGS")}
      </Text>

      {/* ตั้งค่าธีมสี */}
      <HStack alignItems="center" mb={4}>
        <Text fontSize="md" color={colorTheme.colors.text}>
          {t("SETTINGS.THEME_COLOR")}
        </Text>
        <Spacer />
        <Switch
          onTrackColor={colorTheme.colors.switch}
          onThumbColor={colorTheme.colors.primary}
          offTrackColor={colorTheme.colors.border}
          offThumbColor={colorTheme.colors.primary}
          isChecked={colorTheme.colors.background === "#121212"}
          onToggle={toggleTheme}
        />
      </HStack>

      {/* ตั้งค่าภาษา */}
      <HStack alignItems="center">
        <Text fontSize="md" color={colorTheme.colors.text} mr={4}>
          {t("SETTINGS.LANGUAGE")}
        </Text>
        <Spacer />
        <LanguageButtonGroup
          langs={["th", "en"]}
          value={currentLanguage}
          color={colorTheme.colors.primary}
          onPress={handleLanguageChange}
        />
      </HStack>
    </VStack>
  );
};

export default SettingScreen;