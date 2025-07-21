import { VStack, Text, Box, HStack, Image, Skeleton, Divider, Center } from "native-base";
import React, { useCallback, useMemo } from "react";
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
import { useNavigateWithLoading } from "../hooks/useNavigateWithLoading";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";

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

  useFocusEffect(
    useCallback(() => {
      getNotifications();
    }, [getNotifications])
  );

  const handleMarkAsRead = async (notificationId: number) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  // จัดกลุ่มการแจ้งเตือนตามวันที่
  const groupedNotifications = useMemo(() => {
  const filtered = notifications.filter((item) => item.created_at);
  const groups: { [key: string]: INotification[] } = {};

  filtered.forEach((notification) => {
    const createdDate = dayJs(notification.created_at);
    const now = dayJs();
    
    let groupKey = "";
    
    if (createdDate.isSame(now, 'day')) {
      groupKey = t('NOTIFICATION.TODAY');
    } else if (createdDate.isSame(now.subtract(1, 'day'), 'day')) {
      groupKey = t('NOTIFICATION.YESTERDAY');
    } else if (createdDate.isAfter(now.subtract(7, 'day'))) {
      groupKey = t('NOTIFICATION.LAST_WEEK');
    } else if (createdDate.isAfter(now.subtract(30, 'day'))) {
      groupKey = t('NOTIFICATION.LAST_MONTH');
    } else {
      groupKey = t('NOTIFICATION.OLDER');
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });

  // เรียงลำดับกลุ่มตามความสำคัญ
  const orderedGroups: { [key: string]: INotification[] } = {};
  const groupOrder = [
    t('NOTIFICATION.TODAY'),
    t('NOTIFICATION.YESTERDAY'),
    t('NOTIFICATION.LAST_WEEK'),
    t('NOTIFICATION.LAST_MONTH'),
    t('NOTIFICATION.OLDER')
  ];
  
  groupOrder.forEach(groupKey => {
    if (groups[groupKey]) {
      // เรียงลำดับการแจ้งเตือนในแต่ละกลุ่มจากใหม่ไปเก่า
      orderedGroups[groupKey] = groups[groupKey].sort((a, b) => 
        dayJs(b.created_at).valueOf() - dayJs(a.created_at).valueOf()
      );
    }
  });

  return orderedGroups;
}, [notifications, t]);


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
    <Text
      fontSize="sm"
      fontWeight="bold"
      color='gray.500'
      opacity={0.7}
    >
      {groupTitle}
    </Text>
    <Box flex={1} height="1px" bg={colorTheme.colors.border} opacity={0.5} />
  </HStack>
);


  if (loading) {
    return (
      <ScreenWrapper>
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
      </ScreenWrapper>
    );
  }

  return (
    <>
      <AppHeader title={t("SCREENS.NOTIFICATION")} />
      <ScreenWrapper>
        <VStack space={2}>
          {Object.entries(groupedNotifications).map(([groupTitle, notificationList]) => (
            <VStack key={groupTitle} space={2}>
              {renderGroupHeader(groupTitle)}
              {notificationList.map((notification) => (
                <Box key={notification.id} mb={2}>
                  {renderNotificationItem(notification)}
                </Box>
              ))}
            </VStack>
          ))}
          
          {Object.keys(groupedNotifications).length === 0 && (
            <Center flexGrow={1} h='full'>
              <Text color="gray.500" fontSize="md">
                {t("NOTIFICATION.NO_NOTIFICATIONS")}
              </Text>
            </Center>
          )}
        </VStack>
      </ScreenWrapper>
    </>
  );
};

export default NotificationScreen;
