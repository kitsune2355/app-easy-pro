import React, { useState } from "react";
import { Pressable } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import AppHeader from "../components/AppHeader";
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
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Ionicons, FontAwesome } from "react-native-vector-icons";
import { getBackgroundColor, statusItems } from "../constant/ConstantItem";
import { useSelector } from "react-redux";
import { dayJs } from "../config/dayJs";
import RepairStatusProgress from "../components/RepairStatusProgress";

const RepairHistoryCard = ({
  item,
  colorTheme,
  statusText,
  statusIcon,
  statusColor,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
              _text={{
                fontSize: "2xs",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {t(`PROCESS.${statusText}`)}
            </Badge>
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
                "DD MMM YYYY, HH:mm น."
              )}
            </Text>
          </HStack>

          <VStack space={1}>
            <Button
              variant={"solid"}
              rounded="3xl"
              size="sm"
              bg={statusColor}
              _text={{ color: "white", fontWeight: "bold" }}
              isDisabled={item.status !== "pending"}
            >
              รับงาน
            </Button>
            {item.status !== "pending" && (
              <Button
                variant={"solid"}
                rounded="3xl"
                size="sm"
                bg={statusColor}
                _text={{ color: "white", fontWeight: "bold" }}
                isDisabled={item.status === "completed"}
              >
                ส่งงาน
              </Button>
            )}
          </VStack>
        </VStack>
      </Collapse>
    </VStack>
  );
};

const RepairHistoryScreen = () => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { repairs } = useSelector((state: any) => state.repair);

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "INPROGRESS" | "COMPLETED">("ALL");

  const filteredRepairs = repairs.filter((item) => {
    if (activeTab === "ALL") {
      return true;
    }
    return item.status === activeTab.toLowerCase();
  });

  const getStatusKey = (tab: string): "pending" | "completed" | "inprogress" | "all" => {
    if (tab === "ALL") return "all";
    return tab.toLowerCase() as "pending" | "completed" | "inprogress";
  };

  return (
    <React.Fragment>
      <AppHeader
        title={t("MENU.REPAIR_REQ_HISTORY")}
        bgColor={colorTheme.colors.card}
      />
      {/* Tab Navigation */}
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
            onPress={() => setActiveTab(tab as "ALL" | "PENDING" | "INPROGRESS" | "COMPLETED")}
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
                {tab === "ALL" ? t(`PROCESS.ALL`) : t(`PROCESS.${tab}`)}
              </Text>
            </Center>
          </Pressable>
        ))}
      </HStack>

      <ScreenWrapper>
        <VStack bg={colorTheme.colors.background} flex={1} pb={4}>
          <VStack pb={4}>
            <RepairStatusProgress statusKey={getStatusKey(activeTab)} />
          </VStack>
          {/* Render filtered repairs */}
          {filteredRepairs.length > 0 ? (
            filteredRepairs.map((item) => {
              const status =
                statusItems[item.status as keyof typeof statusItems];
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
                {t("NO_REPAIRS_FOUND")}
              </Text>
            </Center>
          )}
        </VStack>
      </ScreenWrapper>
    </React.Fragment>
  );
};
export default RepairHistoryScreen;
