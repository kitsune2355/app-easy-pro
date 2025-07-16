import { useNavigation } from "@react-navigation/native";
import { Text, HStack, IconButton, Box, Badge, VStack } from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigateWithLoading } from "../hooks/useNavigateWithLoading";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const AppBarHeader: React.FC = () => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const navigation = useNavigation<any>();
  const navigateWithLoading = useNavigateWithLoading();

  const { unreadCount } = useSelector((state: RootState) => state.notify);

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
        <Text fontSize="xl" fontWeight="bold" color={colorTheme.colors.text}>
          {t("APP_BAR.WELCOME")}{" "}
          <Text color={colorTheme.colors.main}>EasyPro</Text>
        </Text>
      </HStack>
      <Box alignItems="center">
        <VStack>
          {unreadCount > 0 && (
            <Badge
              colorScheme="danger"
              rounded="full"
              mb={-4}
              mr={-1}
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 10,
                color: "white",
              }}
            >
              {unreadCount}
            </Badge>
          )}
          <IconButton
            icon={
              <Ionicons
                name="notifications-outline"
                size={26}
                color={colorTheme.colors.text}
              />
            }
            onPress={() => navigateWithLoading("NotificationScreen")}
            _pressed={{
              bg: colorTheme.colors.border,
              opacity: 0.7,
            }}
            borderRadius="full"
            p="2"
          />
        </VStack>
      </Box>
    </HStack>
  );
};

export default AppBarHeader;
