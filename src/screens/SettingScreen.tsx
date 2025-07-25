import { VStack, Text, HStack, Switch, Spacer, Button, Icon } from "native-base";
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
import { FontAwesome5,Ionicons } from "react-native-vector-icons";

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
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <VStack flex={1} space={2} p={4}>
      <VStack
        flexGrow={1}
        bg={colorTheme.colors.card}
        p={4}
        rounded="md"
        shadow="2"
      >
        {/* ตั้งค่าธีมสี */}
        <HStack alignItems="center" mb={4} space={2}>
          <Icon
            as={FontAwesome5}
            name="moon"
            size="sm"
            color={colorTheme.colors.text}
          />
          <Text fontSize="md" color={colorTheme.colors.text}>
            {t("SETTINGS.DARK_MODE")}
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
        <HStack alignItems="center" space={2}>
          <Icon
            as={Ionicons}
            name="language"
            size="md"
            color={colorTheme.colors.text}
          />
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

      <VStack safeAreaBottom>
        <Button
          shadow="2"
          bg={colorTheme.colors.card}
          _text={{ color: colorTheme.colors.primary, fontWeight: "bold" }}
          onPress={handleLogout}
        >
          {t("LOGOUT")}
        </Button>
      </VStack>
    </VStack>
  );
};

export default SettingScreen;
