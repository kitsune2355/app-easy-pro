import React, { useState, useEffect } from "react";
import { Alert, Pressable } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
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
  Box,
  useToast,
} from "native-base";
import { Ionicons, FontAwesome } from "react-native-vector-icons";

import ScreenWrapper from "../components/ScreenWrapper";
import AppHeader from "../components/AppHeader";
import RepairStatusProgress from "../components/RepairStatusProgress";

import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getBackgroundColor, statusItems } from "../constant/ConstantItem";
import { dayJs } from "../config/dayJs";
import SearchBar from "../components/SearchBar";
import { useNavigateWithLoading } from "../hooks/useNavigateWithLoading";
import { fetchAllRepairs, updateRepairStatus } from "../service/repairService";
import { AppDispatch } from "../store";

type RepairHistoryScreenRouteProp = RouteProp<
  { RepairHistoryScreen: { statusKey?: string } },
  "RepairHistoryScreen"
>;

type RepairItem = {
  id: string;
  problem_detail: string;
  building: string;
  floor: string;
  room: string;
  report_date: string;
  report_time: string;
  status: "pending" | "inprogress" | "completed";
  name: string;
  phone: string;
};

type RepairHistoryCardProps = {
  item: RepairItem;
  colorTheme: any;
  statusText: string;
  statusIcon: string;
  statusColor: string;
  t: any;
};

const RepairHistoryCard = ({
  item,
  colorTheme,
  statusText,
  statusIcon,
  statusColor,
  t,
}: RepairHistoryCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigateWithLoading = useNavigateWithLoading();
  const [isOpen, setIsOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const toast = useToast();

  const handleAcceptWork = async (id: string) => {
    try {
      setAccepting(true);
      const res = await dispatch(updateRepairStatus(id));
      if (res.status === "success") {
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="full" mb={5}>
              <Text color="white"> {t("WORK_ACCEPTANCE.SUCCESS_MESSAGE")} #{id}</Text>
            </Box>
          );
        },
      });
      } else {
      toast.show({
        render: () => {
          return (
            <Box bg="red.500" px="2" py="1" rounded="full" mb={5}>
              <Text color="white">{t("WORK_ACCEPTANCE.ERROR_MESSAGE")}</Text>
            </Box>
          );
        },
      });
    }
    } catch (error) {
      console.error("Error updating repair status:", error);
    } finally {
      setAccepting(false);
    }
  };

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
              #{item.id}
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
          <HStack space={2} alignItems="center">
            <Badge
              bgColor={statusColor}
              variant="solid"
              px={2}
              py={0.5}
              rounded="full"
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
            <Text color={colorTheme.colors.text}>{item.phone}</Text>
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
            <HStack space={2}>
              <Text color={colorTheme.colors.text}>
                {t("BUILDING")} {item.building}
              </Text>
              <Text color={colorTheme.colors.text}>
                {t("FLOOR")} {item.floor}
              </Text>
              <Text color={colorTheme.colors.text}>
                {t("ROOM")} {item.room}
              </Text>
            </HStack>
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
                "DD MMM YYYY, HH:mm "
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
                navigateWithLoading("RepairDetailScreen", {
                  repairId: item.id,
                })
              }
            >
              {t("COMMON.MORE_DETAILS")}
            </Button>
            <Button
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
            {item.status !== "pending" && (
              <Button
                variant="solid"
                rounded="3xl"
                size="sm"
                bg={statusColor}
                _text={{ color: "white", fontWeight: "bold" }}
                isDisabled={item.status === "completed"}
              >
                {t("SUBMIT_WORK")}
              </Button>
            )}
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
  const { repairs } = useSelector((state: any) => state.repair);
  const route = useRoute<RepairHistoryScreenRouteProp>();

  const [activeTab, setActiveTab] = useState<
    "ALL" | "PENDING" | "INPROGRESS" | "COMPLETED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllRepairs());
  }, [repairs]);

  useEffect(() => {
    if (route.params?.statusKey) {
      setActiveTab(route.params.statusKey.toUpperCase() as typeof activeTab);
    }
  }, [route.params?.statusKey]);

  const getStatusKey = (
    tab: typeof activeTab
  ): "all" | "pending" | "inprogress" | "completed" => {
    return tab === "ALL" ? "all" : (tab.toLowerCase() as any);
  };

  const filteredRepairs = repairs.filter((item: RepairItem) => {
    const statusMatch =
      activeTab === "ALL" ? true : item.status === activeTab.toLowerCase();

    const searchMatch =
      searchQuery === ""
        ? true
        : item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.problem_detail
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phone.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <AppHeader
        title={t("MENU.REPAIR_REQ_HISTORY")}
        bgColor={colorTheme.colors.card}
      />

      <HStack
        bg={colorTheme.colors.card}
        justifyContent="space-around"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor={colorTheme.colors.border}
      >
        {["ALL", "PENDING", "INPROGRESS", "COMPLETED"].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab as typeof activeTab)}
            style={{ flex: 1 }}
          >
            <Center
              py={2}
              bg={activeTab === tab ? colorTheme.colors.primary : "transparent"}
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={activeTab === tab ? "white" : colorTheme.colors.text}
              >
                {t(`PROCESS.${tab}`)}
              </Text>
            </Center>
          </Pressable>
        ))}
      </HStack>

      <ScreenWrapper>
        <VStack bg={colorTheme.colors.background} flex={1} pb={4}>
          {/* Search Bar Component */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />

          <VStack pb={4}>
            <RepairStatusProgress statusKey={getStatusKey(activeTab)} />
          </VStack>

          {filteredRepairs.length > 0 ? (
            filteredRepairs.map((item: RepairItem) => {
              const status = statusItems[item.status];
              return (
                <RepairHistoryCard
                  key={item.id}
                  item={item}
                  colorTheme={colorTheme}
                  statusText={status.text}
                  statusIcon={status.icon}
                  statusColor={status.color}
                  t={t}
                />
              );
            })
          ) : (
            <Center>
              <Text color={colorTheme.colors.text}>
                {searchQuery ? t("NO_SEARCH_RESULTS") : t("NO_REPAIRS_FOUND")}
              </Text>
            </Center>
          )}
        </VStack>
      </ScreenWrapper>
    </>
  );
};

export default RepairHistoryScreen;
