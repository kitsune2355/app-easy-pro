import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Linking, Pressable, TouchableOpacity } from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  VStack,
  HStack,
  Text,
  Icon,
  Collapse,
  Center,
  Badge,
  Button,
} from "native-base";
import { Ionicons, FontAwesome } from "react-native-vector-icons";
import AppHeader from "../components/AppHeader";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getBackgroundColor, statusItems } from "../constant/ConstantItem";
import { dayJs } from "../config/dayJs";
import SearchBar from "../components/SearchBar";
import { fetchAllRepairs } from "../service/repairService";
import { AppDispatch, RootState } from "../store";
import { useToastMessage } from "../components/ToastMessage";
import { IRepair } from "../interfaces/repair.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";

type mainTabType = "ALL" | "MINE";
type subTabType = "ALL" | "PENDING" | "INPROGRESS" | "COMPLETED";

interface RepairHistoryParams {
  statusKey?: string;
}

const RepairHistoryCard = ({
  item,
  colorTheme,
  statusText,
  statusIcon,
  statusColor,
  t,
}: {
  item: IRepair;
  colorTheme: any;
  statusText: string;
  statusIcon: string;
  statusColor: string;
  t: any;
  mainTab: mainTabType;
  subTab: subTabType;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const [isOpen, setIsOpen] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const { showToast } = useToastMessage();

  // const handleAcceptWork = useCallback(async (id: string) => {
  //   try {
  //     setAccepting(true);
  //     const res = await dispatch(updateRepairStatus(id, "inprogress"));
  //     if (res?.status === "success") {
  //       showToast("success", `${t("WORK_ACCEPTANCE.SUCCESS_MESSAGE")} #${id}`);
  //     } else {
  //       showToast("error", t("WORK_ACCEPTANCE.ERROR_MESSAGE"));
  //     }
  //   } catch (error) {
  //     console.error("Error updating repair status:", error);
  //     showToast("error", t("WORK_ACCEPTANCE.ERROR_MESSAGE"));
  //   } finally {
  //     setAccepting(false);
  //   }
  // },[dispatch, showToast, t]);

  return (
    <VStack
      bg={colorTheme.colors.card}
      p={4}
      mb={3}
      borderRadius="md"
      shadow={1}
    >
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        <HStack space={3} justifyContent="space-between" alignItems="center">
          <Center bg={getBackgroundColor(statusColor)} rounded="full" size="10">
            <Icon
              as={Ionicons}
              name={statusIcon}
              size="5"
              color={statusColor}
            />
          </Center>
          <VStack flex={1}>
            <Text
              w="80%"
              bold
              fontSize="md"
              color={colorTheme.colors.text}
              numberOfLines={1}
            >
              {item.rp_format}
            </Text>
          </VStack>
          <Icon
            as={Ionicons}
            name={isOpen ? "chevron-up" : "chevron-down"}
            size="md"
            color={colorTheme.colors.text}
          />
        </HStack>
      </Pressable>

      <Collapse isOpen={isOpen}>
        <VStack
          mt={3}
          pt={3}
          borderTopWidth={1}
          borderTopColor={colorTheme.colors.border}
          space={3}
        >
          <HStack space={2}>
            <Badge
              bgColor={statusColor}
              rounded="full"
              px={2}
              py={0.5}
              _text={{ fontSize: "2xs", fontWeight: "bold", color: "white" }}
            >
              {t(`PROCESS.${statusText}`)}
            </Badge>
          </HStack>

          <HStack space={3}>
            <Icon
              as={FontAwesome}
              name="user"
              size="sm"
              color={colorTheme.colors.text}
            />
            <Text color={colorTheme.colors.text}>{item.name}</Text>
          </HStack>

          <HStack space={3}>
            <Icon
              as={FontAwesome}
              name="phone"
              size="sm"
              color={colorTheme.colors.text}
            />
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
            >
              <Text color="blue.500">
                {item.phone}
              </Text>
            </TouchableOpacity>
          </HStack>

          <HStack space={3}>
            <Icon
              as={FontAwesome}
              name="file-text"
              size="sm"
              color={colorTheme.colors.text}
            />
            <Text color={colorTheme.colors.text}>{item.problem_detail}</Text>
          </HStack>

          <HStack space={3}>
            <Icon
              as={FontAwesome}
              name="map-marker"
              size="sm"
              color={colorTheme.colors.text}
            />
            <Text color={colorTheme.colors.text}>
              {item.building} {item.floor} {item.room}
            </Text>
          </HStack>

          <HStack space={3}>
            <Icon
              as={Ionicons}
              name="calendar"
              size="sm"
              color={colorTheme.colors.text}
            />
            <Text color={colorTheme.colors.text}>
              {dayJs(`${item.report_date} ${item.report_time}`).format(
                "DD MMM YYYY, HH:mm"
              )}
            </Text>
          </HStack>

          <VStack space={1}>
            <Button
              variant="outline"
              rounded="3xl"
              size="sm"
              borderColor={statusColor}
              _text={{ color: statusColor, fontWeight: "bold" }}
              onPress={() =>
                navigation.navigate("RepairDetailScreen", { repairId: item.id })
              }
            >
              {t("COMMON.MORE_DETAILS")}
            </Button>
            {/* <Button
              variant="solid"
              rounded="3xl"
              size="sm"
              bg={statusColor}
              _text={{ color: "white", fontWeight: "bold" }}
              isDisabled={item.status !== "pending"}
              isLoading={accepting}
              onPress={() => handleAcceptWork(item.id)}
            >
              {t("ACCEPT_WORK")}
            </Button>
            {item.process_date && item.process_time && (
              <Button
                variant="solid"
                rounded="3xl"
                size="sm"
                bg={statusColor}
                _text={{ color: "white", fontWeight: "bold" }}
                isDisabled={item.status === "completed"}
                onPress={() =>
                  navigation.navigate("RepairSubmitScreen", {
                    repairId: item.id,
                  })
                }
              >
                {t("SUBMIT_WORK")}
              </Button>
            )} */}
          </VStack>
        </VStack>
      </Collapse>
    </VStack>
  );
};

const RepairHistoryScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { repairs } = useSelector((state: RootState) => state.repair);

  const route =
    useRoute<RouteProp<Record<string, RepairHistoryParams>, string>>();
  const { statusKey } = route.params || {};

  const [mainTab, setMainTab] = useState<mainTabType>("ALL");
  const [subTab, setSubTab] = useState<subTabType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  const onFetchAllRepairs = useCallback(() => {
    dispatch(fetchAllRepairs());
  }, [dispatch]);

  useFocusEffect(onFetchAllRepairs);

  useEffect(() => {
    const loadUser = async () => {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const parsedUser = userInfoString ? JSON.parse(userInfoString) : null;
      setUser(parsedUser);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (statusKey) {
      setSubTab(statusKey.toUpperCase() as subTabType);
    }
    dispatch(fetchAllRepairs());
  }, [dispatch, statusKey]);

  const filteredRepairs = useMemo(() => {
    return repairs.filter((item: IRepair) => {
      const statusMatch =
        subTab === "ALL" ? true : item.status === subTab.toLowerCase();
      const mineMatch =
        mainTab === "ALL" ? true : item.received_by?.user_id === user?.id;
      const searchLower = searchQuery.toLowerCase();

      const searchMatch =
        searchQuery === ""
          ? true
          : item.rp_format.toLowerCase().includes(searchLower) ||
            (item.problem_detail?.toLowerCase()?.includes(searchLower) ??
              false) ||
            (item.building?.toLowerCase()?.includes(searchLower) ?? false) ||
            (item.floor?.toLowerCase()?.includes(searchLower) ?? false) ||
            (item.room?.toLowerCase()?.includes(searchLower) ?? false) ||
            (item.name?.toLowerCase()?.includes(searchLower) ?? false) ||
            (item.phone?.toLowerCase()?.includes(searchLower) ?? false);

      return statusMatch && mineMatch && searchMatch;
    });
  }, [repairs, searchQuery, subTab, mainTab, user]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const renderEmptyComponent = () => (
    <VStack flexGrow={1} h="full" justifyContent="center" alignItems="center">
      <Text color={colorTheme.colors.text}>
        {searchQuery ? t("NO_SEARCH_RESULTS") : t("NO_REPAIRS_FOUND")}
      </Text>
    </VStack>
  );

  const tabOptions =
    mainTab === "ALL"
      ? ["ALL", "PENDING", "INPROGRESS", "COMPLETED"]
      : ["ALL", "INPROGRESS", "COMPLETED"];

  return (
    <VStack flex={1} bg={colorTheme.colors.background}>
      <AppHeader
        title={t("MENU.REPAIR_REQ_HISTORY")}
        rightContent={
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
        }
        bgColor={colorTheme.colors.card}
      />

      <>
        {user?.role === "admin" && (
          <HStack bg={colorTheme.colors.card}>
            {["ALL", "MINE"].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setMainTab(tab as typeof mainTab)}
                style={{ flex: 1 }}
              >
                <Center
                  py={2}
                  bg={mainTab === tab ? colorTheme.colors.dark : "transparent"}
                  borderBottomWidth={1}
                  borderBottomColor={colorTheme.colors.border}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={mainTab === tab ? "white" : colorTheme.colors.text}
                  >
                    {tab === "ALL"
                      ? t("PROCESS.ALL_TASKS")
                      : t("PROCESS.MY_TASKS")}
                  </Text>
                </Center>
              </Pressable>
            ))}
          </HStack>
        )}

        <HStack
          bg={colorTheme.colors.card}
          borderBottomWidth={1}
          borderBottomColor={colorTheme.colors.border}
        >
          {tabOptions.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setSubTab(tab as typeof subTab)}
              style={{ flex: 1 }}
            >
              <Center
                py={2}
                bg={
                  subTab === tab ? colorTheme.colors.darkLight : "transparent"
                }
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={subTab === tab ? "white" : colorTheme.colors.text}
                >
                  {t(`PROCESS.${tab}`)}
                </Text>
              </Center>
            </Pressable>
          ))}
        </HStack>
      </>

      <ScreenWrapper>
        {filteredRepairs.length === 0
          ? renderEmptyComponent()
          : filteredRepairs.map((item, key) => {
              const status = statusItems[item.status] ?? {
                text: item.status,
                icon: "alert-circle",
                color: "gray.400",
              };
              return (
                <RepairHistoryCard
                  key={key}
                  item={item}
                  colorTheme={colorTheme}
                  statusText={status.text}
                  statusIcon={status.icon}
                  statusColor={status.color}
                  t={t}
                  mainTab={mainTab}
                  subTab={subTab}
                />
              );
            })}
      </ScreenWrapper>
    </VStack>
  );
};

export default RepairHistoryScreen;
