import React from "react";
import { Box, HStack, Icon, Progress, Text, VStack } from "native-base";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FontAwesome } from "react-native-vector-icons";

interface RepairStatusProgressProps {
  statusKey: "all" | "pending" | "inprogress" | "completed";
}
type StatusKey = "pending" | "inprogress" | "completed";

export const getStatusCounts = (repairs: any[]) => {
  const pendingCount = repairs.filter((r) => r.status === "pending").length;
  const inProgressCount = repairs.filter(
    (r) => r.status === "inprogress"
  ).length;
  const completedCount = repairs.filter((r) => r.status === "completed").length;
  const totalCount = repairs.length;

  return {
    total: totalCount,
    pending: pendingCount,
    inprogress: inProgressCount,
    completed: completedCount,
  };
};

const getColor = (key: string) => {
  switch (key) {
    case "pending":
      return "amber.500";
    case "inprogress":
      return "blue.500";
    case "completed":
      return "green.500";
    default:
      return "gray.200";
  }
};

const RepairStatusProgress: React.FC<RepairStatusProgressProps> = ({
  statusKey,
}) => {
  const { t } = useTranslation();
  const { repairs } = useSelector((state: any) => state.repair);
  const statusCounts = getStatusCounts(repairs);

  const getValue = (key: keyof typeof statusCounts) => {
    if (statusCounts.total === 0) return 0;
    return (statusCounts[key] / statusCounts.total) * 100;
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
              color={getColor(key)}
            />
            <Text mb="1" fontSize="xs" color="coolGray.700">
              {t(`PROCESS.${key.toUpperCase()}`)}
            </Text>
          </HStack>
          <Text mb="1" fontSize="xs" color="coolGray.700">
            {rounded(percent)} %
          </Text>
        </HStack>
        <Progress
          value={percent}
          size="lg"
          bg="gray.200"
          _filledTrack={{ bg: getColor(key) }}
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
          <Icon as={FontAwesome} name="circle" size="xs" color={getColor(key)} />
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
          <Progress value={100} size="lg" bg="gray.200" _filledTrack={{ bg: "gray.200" }} />
          {barLayers.map((layer, index) => (
            <Progress
              key={index}
              position="absolute"
              top="0"
              left="0"
              right="0"
              value={layer.value}
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
