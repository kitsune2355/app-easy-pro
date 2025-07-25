import {
  VStack,
  Text,
  Box,
  HStack,
  Image,
  Skeleton,
  Center,
} from "native-base";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INotification } from "../interfaces/notify.interface";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../service/notifyService";
import { RootState, AppDispatch } from "../store";
import ScreenWrapper from "../components/ScreenWrapper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { dayJs } from "../config/dayJs";
import { BASE_UPLOAD_PATH, parseImageUrls } from "../components/ImagePreview";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";

const NotificationScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notify
  );

  const getNotifications = useCallback(async () => {
    dispatch(fetchNotifications({ isRead: null }));
  }, [dispatch]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const handleMarkAsRead = async (notificationId: number) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  // จัดกลุ่มการแจ้งเตือนตามวันที่
  const groupedNotifications = useMemo(() => {
    const filtered = notifications.filter((item) => item.created_at);
    const groups: { [key: string]: INotification[] } = {};

    filtered.forEach((notification) => {
      const createdDate = dayJs(notification.created_at).format("YYYY-MM-DD");
      if (!groups[createdDate]) {
        groups[createdDate] = [];
      }
      groups[createdDate].push(notification);
    });

    // เรียงวันที่จากใหม่ไปเก่า
    const orderedGroups: { [key: string]: INotification[] } = {};
    Object.keys(groups)
      .sort((a, b) => dayJs(b).valueOf() - dayJs(a).valueOf())
      .forEach((date) => {
        orderedGroups[date] = groups[date].sort(
          (a, b) =>
            dayJs(b.created_at).valueOf() - dayJs(a.created_at).valueOf()
        );
      });

    return orderedGroups;
  }, [notifications]);

  const renderNotificationItem = (notification: INotification) => {
    const imagesForPreview = parseImageUrls(notification?.image_url).map(
      (path: string) => BASE_UPLOAD_PATH + path.replace(/\\/g, "/")
    );

    return (
      <TouchableOpacity
        key={notification.id.toString()}
        onPress={() => {
          if (!notification.is_read) {
            handleMarkAsRead(notification.id);
          }
          navigation.navigate("RepairDetailScreen", {
            repairId: notification.related_id.toString(),
          });
        }}
      >
        <VStack
          p={4}
          bg={colorTheme.colors.card}
          opacity={notification.is_read ? 0.5 : 1}
          borderWidth={1}
          borderColor={colorTheme.colors.border}
          rounded="lg"
        >
          <HStack alignItems="center" justifyContent="space-between">
            <Text
              fontSize="md"
              fontWeight="bold"
              color={
                notification.type === "repair_request"
                  ? colorTheme.colors.primary
                  : colorTheme.colors.success
              }
            >
              {notification.rp_format}
            </Text>
            {!notification.is_read && (
              <Box rounded="full" bg={colorTheme.colors.notification} p={2} />
            )}
          </HStack>
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text
                color={colorTheme.colors.text}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {notification.desc}, {notification.building}{" "}
                {notification.floor} {notification.room}
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray.500">
                {dayJs(notification.created_at).fromNow()}
              </Text>
            </VStack>

            {imagesForPreview.length > 0 && (
              <Image
                source={{ uri: imagesForPreview[0] }}
                alt="notify thumbnail"
                width={50}
                height={50}
              />
            )}
          </HStack>
        </VStack>
      </TouchableOpacity>
    );
  };

  const renderGroupHeader = (groupTitle: string) => (
    <HStack space={2} alignItems="center" px={1} py={2}>
      <Text fontSize="sm" fontWeight="bold" color="gray.500" opacity={0.7}>
        {dayJs(groupTitle).format("DD MMM YYYY")}
      </Text>
      <Box flex={1} height="1px" bg="gray.500" opacity={0.5} />
    </HStack>
  );

  return (
    <>
      <AppHeader title={t("SCREENS.NOTIFICATION")} />
      <ScreenWrapper>
        {loading ? (
          <VStack space={2}>
            {Array.from({ length: 10 }).map((_, key) => (
              <VStack
                key={key}
                bg={colorTheme.colors.card}
                p={4}
                borderWidth={1}
                borderColor={colorTheme.colors.border}
                rounded="lg"
                space={2}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <Skeleton h="4" w="10" rounded="md" />
                  <Skeleton rounded="full" size="4" />
                </HStack>
                <Skeleton h="3" w="64" rounded="md" />
                <Skeleton h="3" w="20" rounded="md" />
              </VStack>
            ))}
          </VStack>
        ) : (
          <VStack space={2}>
            {Object.entries(groupedNotifications).map(
              ([groupTitle, notificationList]) => (
                <VStack key={groupTitle} space={2}>
                  {renderGroupHeader(groupTitle)}
                  {notificationList.map((notification) => (
                    <Box key={notification.id} mb={2}>
                      {renderNotificationItem(notification)}
                    </Box>
                  ))}
                </VStack>
              )
            )}

            {Object.keys(groupedNotifications).length === 0 && (
              <Center flexGrow={1} h="full">
                <Text color="gray.500" fontSize="md">
                  {t("NOTIFICATION.NO_NOTIFICATIONS")}
                </Text>
              </Center>
            )}
          </VStack>
        )}
      </ScreenWrapper>
    </>
  );
};

export default NotificationScreen;
