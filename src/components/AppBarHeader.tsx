import { useNavigation } from "@react-navigation/native";
import { Text, HStack, IconButton } from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

interface AppBarHeaderProps {
  title: string;
}

const AppBarHeader: React.FC<AppBarHeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <HStack
      bg={colorTheme.colors.card}
      py={2}
      px={4}
      borderBottomWidth={1}
      borderBottomColor={colorTheme.colors.border}
      borderBottomRightRadius="3xl"
      borderBottomLeftRadius="3xl"
      space={3}
      justifyContent="space-between"
      alignItems="center"
      safeAreaTop
    >
      <HStack space={3} alignItems="center">
        <IconButton
          icon={
            <Ionicons
              name="menu-outline"
              size={26}
              color={colorTheme.colors.text}
            />
          }
          onPress={() => navigation.openDrawer()}
          _pressed={{
            bg: colorTheme.colors.border,
            opacity: 0.7,
          }}
          borderRadius="full"
          p="2"
        />
        {title === "HOME" ? (
          <Text fontSize="xl" fontWeight="bold" color={colorTheme.colors.text}>
            {t("APP_BAR.WELCOME")}{" "}
            <Text color={colorTheme.colors.main}>EasyPro</Text>
          </Text>
        ) : (
          <Text fontSize="xl" fontWeight="bold" color={colorTheme.colors.text}>
            {t(`SCREENS.${title}`)}
          </Text>
        )}
      </HStack>
    </HStack>
  );
};

export default AppBarHeader;
