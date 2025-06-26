import React from "react";
import { Box, HStack, Icon, Progress, Text, VStack } from "native-base";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FontAwesome } from "react-native-vector-icons";
import { statusItems } from "../constant/ConstantItem";

interface RepairStatusProgressProps {
  statusKey: "all" | "pending" | "inprogress" | "completed";
}
type StatusKey = "pending" | "inprogress" | "completed";

export const getStatusSummary = (repairs: any[]) => {
  const statusKeys = ["pending", "inprogress", "completed"];

  const summary = statusKeys.reduce((acc, key) => {
    const count = repairs.filter((r) => r.status === key).length;
    const color =
      key === "pending"
        ? "amber.500"
        : key === "inprogress"
        ? "blue.500"
        : key === "completed"
        ? "green.500"
        : "gray.200";
    const text = statusItems[key].text;
    const icon = statusItems[key].icon;

    acc[key] = { count, color, text, icon };
    return acc;
  }, {} as Record<string, { count: number; color: string; text: string; icon: string }>);

  summary.total = {
    count: repairs.length,
    color: "gray.200",
    text: "",
    icon: "list",
  };

  return summary;
};

const RepairStatusProgress: React.FC<RepairStatusProgressProps> = ({
  statusKey,
}) => {
  const { t } = useTranslation();
  const { repairs } = useSelector((state: any) => state.repair);
  const statusItem = getStatusSummary(repairs);

  const getValue = (key: keyof typeof statusItem) => {
    if (statusItem.total.count === 0) return 0;
    return (statusItem[key].count / statusItem.total.count) * 100;
  };

  const rounded = (n: number) => Math.round(n);

  const renderSingleProgress = (
    key: "pending" | "inprogress" | "completed"
  ) => {
    const percent = getValue(key);
    return (
      <Box bg={"white"} p={4} borderRadius="md" shadow={2}>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack space={1} alignItems="center">
            <Icon
              as={FontAwesome}
              name="circle"
              size="xs"
              color={statusItem[key].color}
            />
            <Text mb="1" fontSize="xs" color="coolGray.700">
              {t(`PROCESS.${key.toUpperCase()}`)}
            </Text>
          </HStack>
          <Text mb="1" fontSize="xs" color="coolGray.700">
            {Math.round(percent)} %
          </Text>
        </HStack>
        <Progress
          value={Math.round(percent)}
          size="lg"
          bg="gray.200"
          _filledTrack={{ bg: statusItem[key].color }}
        />
      </Box>
    );
  };

  const renderAllStatus = () => {
    const pending = getValue("pending");
    const inprogress = getValue("inprogress");
    const completed = getValue("completed");

    const barLayers = [
      { value: pending + inprogress + completed, color: "amber.500" },
      { value: inprogress + completed, color: "blue.500" },
      { value: completed, color: "green.500" },
    ];

    const renderLegendItem = (key: StatusKey) => (
      <HStack justifyContent="space-between" alignItems="center" key={key}>
        <HStack space={1} alignItems="center">
          <Icon
            as={FontAwesome}
            name="circle"
            size="xs"
            color={statusItem[key].color}
          />
          <Text fontSize="xs" color="coolGray.700">
            {t(`PROCESS.${key.toUpperCase()}`)}
          </Text>
        </HStack>
        <Text fontSize="xs" color="coolGray.700">
          {Math.round(getValue(key))} %
        </Text>
      </HStack>
    );

    return (
      <Box bg="white" p={4} borderRadius="md" shadow={2}>
        <VStack space={1}>
          {["completed", "inprogress", "pending"].map((key) =>
            renderLegendItem(key as StatusKey)
          )}
        </VStack>

        <Box position="relative" mt={2}>
          <Progress
            value={100}
            size="lg"
            bg="gray.200"
            _filledTrack={{ bg: "gray.200" }}
          />
          {barLayers.map((layer, index) => (
            <Progress
              key={index}
              position="absolute"
              top="0"
              left="0"
              right="0"
              value={Math.round(layer.value)}
              size="lg"
              bg="transparent"
              _filledTrack={{ bg: layer.color }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {statusKey === "all"
        ? renderAllStatus()
        : renderSingleProgress(statusKey)}
    </Box>
  );
};

export default RepairStatusProgress;
