import { VStack, Text, HStack, Icon } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { IRepair } from "../../interfaces/repair.interface";
import { Ionicons } from "@expo/vector-icons";

interface RepairDetailFeedbackInfoViewProps {
  repairDetail: IRepair;
}

const RepairDetailFeedbackInfoView: React.FC<
  RepairDetailFeedbackInfoViewProps
> = ({ repairDetail }) => {
  const { colorTheme } = useTheme();
  const { t } = useTranslation();
  return (
    <VStack bg={colorTheme.colors.card} rounded="xl" p={4} shadow={1}>
      <Text bold fontSize="xl" color={colorTheme.colors.primary}>
        {t("PROCESS.FEEDBACK_INFO")}
      </Text>
      <VStack
        mt={3}
        pt={3}
        borderTopWidth={1}
        borderTopColor={colorTheme.colors.border}
        space={3}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xs" color="gray.500">
            {t("PROCESS.FEEDBACK_INFO")}
          </Text>
          <HStack space={1}>
            {Array.from({
              length: parseInt(repairDetail.feedback?.rating),
            }).map((_, index) => (
              <Icon
                key={index}
                as={Ionicons}
                name="star"
                size="sm"
                color="yellow.400"
              />
            ))}
          </HStack>
        </HStack>
          <Text fontSize="xs" color="gray.500">
            {t("COMMON.COMMENT")}
          </Text>
          <Text fontSize="sm" color={colorTheme.colors.text}>
            {repairDetail.feedback?.comments || "-"}
          </Text>
      </VStack>
    </VStack>
  );
};

export default RepairDetailFeedbackInfoView;
