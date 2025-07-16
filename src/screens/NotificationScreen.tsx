import { VStack, Text, Box, HStack, Image, Center } from "native-base";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INotification } from "../interfaces/notify.interface";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../service/notifyService";
import { RootState, AppDispatch } from "../store";
import ScreenWrapper from "../components/ScreenWrapper";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { dayJs } from "../config/dayJs";
import { BASE_UPLOAD_PATH, parseImageUrls } from "../components/ImagePreview";
import { useNavigateWithLoading } from "../hooks/useNavigateWithLoading";

const NotificationScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigateWithLoading = useNavigateWithLoading();
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

  const renderNotificationItem = (notification: INotification) => {
    const imagesForPreview = parseImageUrls(notification?.image_url).map(
      (path: string) => BASE_UPLOAD_PATH + path.replace(/\\/g, "/")
    );

    return (
      <TouchableOpacity
        key={notification.id.toString()}
        onPress={() => {
          !notification.is_read && handleMarkAsRead(notification.id),
            navigateWithLoading("RepairDetailScreen", {
              repairId: notification.related_id,
            });
        }}
      >
        <VStack
          p={4}
          bg={colorTheme.colors.card}
          opacity={notification.is_read ? 0.6 : 1}
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
              #{notification.related_id}
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
                {notification.desc}, {notification.building} {notification.floor} {notification.room}
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

  return (
    <>
      <AppHeader title={t("SCREENS.NOTIFICATION")} />
      <ScreenWrapper>
        <VStack space={2}>
          {notifications.map((notification) =>
            renderNotificationItem(notification)
          )}
        </VStack>
      </ScreenWrapper>
    </>
  );
};

export default NotificationScreen;
