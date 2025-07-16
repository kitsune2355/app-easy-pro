import React, { useCallback, useEffect } from "react";
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
import { AppDispatch } from "../store";
import { useDoubleBackExit } from "../hooks/useDoubleBackExit";
import { useTranslation } from "react-i18next";
import { dayJs } from "../config/dayJs";
import RepairStatusProgress, {
  getStatusSummary,
} from "../components/RepairStatusProgress";
import { useNavigateWithLoading } from "../hooks/useNavigateWithLoading";
import { useFocusEffect } from "@react-navigation/native";
import { fetchNotifications } from "../service/notifyService";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const navigateWithLoading = useNavigateWithLoading();
  const dispatch = useDispatch<AppDispatch>();
  const { repairs, loading, error } = useSelector((state: any) => state.repair);
  const statusItem = getStatusSummary(repairs);

  useDoubleBackExit();

  const onFetch = useCallback(() => {
    dispatch(fetchAllRepairs());
    dispatch(fetchNotifications({ isRead: null }));
  }, [dispatch]);

  useFocusEffect(onFetch);

  const renderDashboardItem = () => (
    <>
      {statusAll.map((st) => {
        let count = 0;

        if (st.key === "PENDING") {
          count = statusItem.pending.count;
        } else if (st.key === "INPROGRESS") {
          count = statusItem.inprogress.count;
        } else if (st.key === "COMPLETED") {
          count = statusItem.completed.count;
        }

        return (
          <Pressable
            key={st.key}
            width="30%"
            mb="4"
            onPress={() =>
              navigateWithLoading("RepairHistoryScreen", { statusKey: st.key })
            }
          >
            <Center flex={1} bg={colorTheme.colors.card} rounded="2xl" shadow={2} py={2}>
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
    return (
      <Pressable
        key={item.title}
        width="48%"
        mb="4"
        onPress={() => navigateWithLoading(item.screen as never)}
      >
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
      </Pressable>
    );
  };

  const renderActivityAll = () => {
    return (
      <>
        {repairs.slice(0, 3).map((item, key) => {
          const status = statusItems[item.status as keyof typeof statusItems];

          return (
            <Pressable
              bg={colorTheme.colors.card}
              rounded="2xl"
              shadow={2}
              p="4"
              key={key}
              onPress={() =>
                navigateWithLoading("RepairDetailScreen", {
                  repairId: item.id,
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
                  <HStack>
                    <Text
                      color={colorTheme.colors.text}
                      fontSize="md"
                      fontWeight="bold"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      flex={1}
                    >
                      #{item.id}
                    </Text>

                    <Badge
                      bgColor={status.color}
                      variant="solid"
                      px={2}
                      py={0.5}
                      rounded="full"
                      _text={{
                        fontSize: "2xs",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {t(`PROCESS.${status.text}`)}
                    </Badge>
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
                    {dayJs(item.created_at).format("DD MMM YYYY, HH:mm ")}
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
          );
        })}
      </>
    );
  };

  return (
    <VStack space={4}>
      <HStack justifyContent="space-between" alignItems="center">
        <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
          {t("MAIN.REPAIR_SUMMARY")}
        </Text>
        <Text color={colorTheme.colors.text} fontSize="sm" fontWeight="medium">
          ทั้งหมด: {statusItem.total.count}
        </Text>
      </HStack>

      <Pressable
        onPress={() =>
          navigateWithLoading("RepairHistoryScreen", { statusKey: "all" })
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

      <HStack space={4} justifyContent="space-between" alignItems="center">
        <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
          {t("MAIN.RECENT_JOBS")}
        </Text>
      </HStack>

      {renderActivityAll()}
    </VStack>
  );
};

export default HomeScreen;
