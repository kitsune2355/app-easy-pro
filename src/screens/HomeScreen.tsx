import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  VStack,
  Text,
  Center,
  Icon,
  Flex,
  Box,
  HStack,
  Badge,
  Pressable,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import {
  getBackgroundColor,
  gradientcolorTheme,
  processItem,
  statusAll,
  statusItems,
} from "../constant/ConstantItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRepairs } from "../service/repairService";
import { AppDispatch, RootState } from "../store";
import { useDoubleBackExit } from "../hooks/useDoubleBackExit";
import { useTranslation } from "react-i18next";
import { dayJs } from "../config/dayJs";
import RepairStatusProgress, {
  getStatusSummary,
} from "../components/RepairStatusProgress";
import { fetchNotifications } from "../service/notifyService";
import ScreenWrapper from "../components/ScreenWrapper";
import { IRepair } from "../interfaces/repair.interface";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import { findNotificationIdByRepairId } from "../utils/notifications";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { repairs } = useSelector((state: any) => state.repair);
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.notify);
  const statusItem = getStatusSummary(repairs);
  const [refreshing, setRefreshing] = useState(false);

  useDoubleBackExit();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      dispatch(fetchAllRepairs()),
      dispatch(fetchNotifications({ isRead: null })),
    ]).finally(() => setRefreshing(false));
  }, [dispatch]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const renderDashboardItem = () => (
    <>
      {statusAll.map((st) => {
        let count = 0;
        if (st.key === "PENDING") count = statusItem.pending.count;
        else if (st.key === "INPROGRESS") count = statusItem.inprogress.count;
        else if (st.key === "COMPLETED") count = statusItem.completed.count;
        else if (st.key === "FEEDBACK")
          count = repairs.filter((item) => item.has_feedback === "1").length;

        return (
          <Pressable
            key={st.key}
            width="23.5%"
            mb="4"
            onPress={() =>
              navigation.navigate("RepairHistoryScreen", { statusKey: st.key })
            }
          >
            <Center
              flex={1}
              bg={colorTheme.colors.card}
              rounded="2xl"
              shadow={2}
              p={2}
            >
              <VStack flexGrow={1} alignItems="center">
                <Icon
                  as={Ionicons}
                  name={st.icon}
                  size="8"
                  mb="2"
                  color={st.color}
                />
                <Text
                  color={colorTheme.colors.text}
                  fontSize="sm"
                  fontWeight="medium"
                  textAlign="center"
                >
                  {t(`PROCESS.${st.key}`)}
                </Text>
              </VStack>
              <Text
                color={colorTheme.colors.text}
                fontSize="2xl"
                fontWeight="medium"
                textAlign="center"
              >
                {count}
              </Text>
            </Center>
          </Pressable>
        );
      })}
    </>
  );

  const renderProcessItem = (item: any, key: number) => {
    const status = statusItems[item.status as keyof typeof statusItems] || {
      icon: "help",
      color: "gray.400",
      text: "UNKNOWN",
    };

    const notificationId = findNotificationIdByRepairId(notifications, item.id);

    return (
      <Pressable
        key={item.title}
        width="48%"
        mb="4"
        onPress={() => navigation.navigate(item.screen as never)}
      >
        {item.role.includes(user?.role) && (
          <Box
            bg={{
              linearGradient: {
                colors: gradientcolorTheme[key],
                start: [0, 0],
                end: [1, 1],
              },
            }}
            rounded="3xl"
            shadow={2}
            p="4"
            h="32"
          >
            <Center flex={1}>
              <Icon as={Ionicons} name={item.icon} size="12" color="white" />
              <Text
                color="white"
                fontSize="md"
                mb="1"
                textAlign="center"
                fontWeight="bold"
              >
                {t(`MENU.${item.title}`)}
              </Text>
            </Center>
          </Box>
        )}
      </Pressable>
    );
  };

  const renderActivityAll = (repairs: IRepair[]) => (
    <>
      {repairs.slice(0, 3).map((item, key) => {
        let status = statusItems[item.status as keyof typeof statusItems];

        // ถ้า status เป็น feedback และ has_feedback !== 1 ให้ใช้ status เริ่มต้น
        if (item.status === "feedback" && item.has_feedback !== "1") {
          status = {
            text: item.status,
            icon: "alert-circle",
            color: "gray.400",
          };
        }

        return (
          <Pressable
            bg={colorTheme.colors.card}
            rounded="2xl"
            shadow={2}
            p="4"
            key={key}
            onPress={() =>
              navigation.navigate("RepairDetailScreen", {
                repairId: item.id,
                notificationId:
                  findNotificationIdByRepairId(notifications, item.id) ||
                  undefined,
              })
            }
          >
            <HStack alignItems="flex-start" space={3}>
              <Center
                bg={getBackgroundColor(status.color)}
                rounded="full"
                size="10"
              >
                <Icon
                  as={Ionicons}
                  name={status.icon}
                  size="5"
                  color={status.color}
                />
              </Center>

              <VStack flex={1} space={1}>
                <HStack alignItems="center">
                  <Text
                    color={colorTheme.colors.text}
                    fontSize="md"
                    fontWeight="bold"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    flex={1}
                  >
                    {item.rp_format}
                  </Text>
                  <VStack space={1}>
                    <Badge
                      bgColor={status.color}
                      variant="solid"
                      px={2}
                      py={0.5}
                      rounded="full"
                      alignSelf="flex-end"
                      _text={{
                        fontSize: "2xs",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {t(`PROCESS.${status.text}`)}
                    </Badge>
                    {item.status === "completed" &&
                      item.has_feedback === "0" && (
                        <Badge
                          bgColor="yellow.100"
                          borderColor="yellow.500"
                          variant="outline"
                          px={2}
                          py={0.5}
                          rounded="full"
                          _text={{
                            fontSize: "2xs",
                            fontWeight: "bold",
                            color: "yellow.500",
                          }}
                        >
                          <HStack alignItems="center" space={1}>
                            <Icon
                              as={Ionicons}
                              name="alert-circle"
                              size="4"
                              color="yellow.500"
                            />
                            <Text fontSize="2xs" bold color="yellow.500">
                              {t(`PROCESS.WAITING_FEEDBACK`)}
                            </Text>
                          </HStack>
                        </Badge>
                      )}
                  </VStack>
                </HStack>
                <Text
                  color={colorTheme.colors.text}
                  fontSize="sm"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.problem_detail}
                </Text>
                <Text
                  color={colorTheme.colors.text}
                  fontSize="sm"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.building} {item.floor} {item.room}
                </Text>
                <Text color="gray.500" fontSize="xs">
                  {dayJs(item.created_at).format("DD MMM YYYY, HH:mm")}
                </Text>
              </VStack>
            </HStack>
          </Pressable>
        );
      })}
    </>
  );

  const renderMyTasksSection = (title: string, filteredRepairs: IRepair[]) => (
    <>
      <HStack space={4} justifyContent="space-between" alignItems="center">
        <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
          {title}
        </Text>
      </HStack>
      {renderActivityAll(filteredRepairs)}
    </>
  );

  return (
    <ScreenWrapper refreshing={refreshing} onRefresh={onRefresh}>
      <VStack space={4}>
        {user?.role !== "admin" &&
          repairs.some(
            (item) =>
              item.created_by.user_id === user?.id &&
              item.status === "completed" &&
              item.has_feedback === "0"
          ) &&
          renderMyTasksSection(
            t("COMMON.FEEDBACK"),
            repairs.filter(
              (item) => item.status === "completed" && item.has_feedback === "0"
            )
          )}

        <HStack justifyContent="space-between" alignItems="center">
          <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
            {t("MAIN.REPAIR_SUMMARY")}
          </Text>
          <Text
            color={colorTheme.colors.text}
            fontSize="sm"
            fontWeight="medium"
          >
            ทั้งหมด: {statusItem.total.count}
          </Text>
        </HStack>
        <Pressable
          onPress={() =>
            navigation.navigate("RepairHistoryScreen", { statusKey: "all" })
          }
        >
          <RepairStatusProgress statusKey="all" repairs={repairs} />
        </Pressable>

        <Flex direction="row" wrap="wrap" justify="space-between">
          {renderDashboardItem()}
        </Flex>

        <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
          {t("MAIN.URGENT_ACTION")}
        </Text>
        <Flex direction="row" wrap="wrap" justify="space-between">
          {processItem.map((item, key) => renderProcessItem(item, key))}
        </Flex>

        {user?.role === "admin" &&
          repairs.filter((item) => item.status === "pending").length > 0 && (
            <>
              <HStack
                space={4}
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  color={colorTheme.colors.text}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {t("MAIN.REPAIR_REQ_LIST")}
                </Text>
              </HStack>
              {renderActivityAll(
                repairs.filter((item) => item.status === "pending")
              )}
            </>
          )}

        {user?.role === "admin" &&
          repairs.some(
            (item) =>
              item.received_by.user_id === user?.id &&
              item.status === "inprogress"
          ) &&
          renderMyTasksSection(
            t("PROCESS.MY_TASKS"),
            repairs.filter(
              (item) =>
                item.received_by.user_id === user?.id &&
                item.status === "inprogress"
            )
          )}

        {user?.role !== "admin" &&
          repairs.some(
            (item) =>
              item.created_by.user_id === user?.id &&
              item.status !== "feedback"
          ) &&
          renderMyTasksSection(
            t("PROCESS.MY_REPAIR_REQ"),
            repairs.filter(
              (item) =>
                item.created_by.user_id === user?.id &&
                item.status !== "feedback"
            )
          )}
      </VStack>
    </ScreenWrapper>
  );
};

export default HomeScreen;
