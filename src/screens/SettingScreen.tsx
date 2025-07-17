import { VStack, Text, HStack, Switch, Spacer, Button } from "native-base";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n from "../config/il8n";
import { LanguageButtonGroup } from "../components/LanguageButtonGroup";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";

const SettingScreen: React.FC = () => {
  const { colorTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { logoutUser } = useAuth();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      await logoutUser();
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <VStack flexGrow={1} bg={colorTheme.colors.card} m={4} p={4} rounded="md">
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

      <VStack p={4} space={4} safeAreaBottom>
        <Button
          bg={colorTheme.colors.card}
          _text={{ color: colorTheme.colors.primary, fontWeight: "bold" }}
          onPress={handleLogout}
        >
          {t("LOGOUT")}
        </Button>
      </VStack>
    </>
  );
};

export default SettingScreen;
