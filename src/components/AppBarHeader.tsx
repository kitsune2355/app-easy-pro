import { useNavigation } from "@react-navigation/native";
import { Text, HStack, IconButton, Box, VStack, Badge } from "native-base";
import React, { useCallback, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchNotifications } from "../service/notifyService";
import { fetchUserById } from "../service/userService";
import { fetchAllRepairs } from "../service/repairService";

interface AppBarHeaderProps {
  title: string;
}

const AppBarHeader: React.FC<AppBarHeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { unreadCount } = useSelector((state: RootState) => state.notify);
  const { user } = useSelector((state: RootState) => state.auth);

  const getNotifications = useCallback(async () => {
    await dispatch(fetchAllRepairs());
    dispatch(fetchNotifications({ isRead: null }));
  }, [dispatch]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  }, []);

  return (
    <HStack
      bg={colorTheme.colors.card}
      py={2}
      px={4}
      borderBottomWidth={1}
      borderBottomColor={colorTheme.colors.border}
      borderBottomRightRadius="3xl"
      borderBottomLeftRadius="3xl"
      space={1}
      justifyContent="space-between"
      alignItems="center"
      safeAreaTop
    >
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
      <HStack flexGrow={1} alignItems="center" justifyContent="space-between">
        {title === "HOME" ? (
          <>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={colorTheme.colors.text}
            >
              {t("APP_BAR.WELCOME")}{" "}
              <Text color={colorTheme.colors.main}>EasyPro</Text>
            </Text>

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
                    onPress={() => navigation.navigate("NotificationScreen")}
                    _pressed={{
                      bg: colorTheme.colors.border,
                      opacity: 0.7,
                    }}
                    borderRadius="full"
                    p="2"
                  />
                </VStack>
              </Box>
          </>
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
