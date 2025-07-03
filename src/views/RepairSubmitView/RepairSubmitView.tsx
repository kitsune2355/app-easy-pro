import { Box, HStack, Text, VStack } from "native-base";
import React from "react";
import ImagePreview from "../../components/ImagePreview";
import { IRepair } from "../../interfaces/repair.interface";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { dayJs } from "../../config/dayJs";

interface RepairSubmitViewProps {
  images: string[];
  jobDetails: IRepair | null;
  solution: string;
}

const RepairSubmitView: React.FC<RepairSubmitViewProps> = ({
  images,
  jobDetails,
  solution,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  return (
    <VStack space={4}>
      <Text bold fontSize="md">
        🔍 {t("FORM.REPAIR_SUBMIT.VERIFY_INFO")}
      </Text>
      <Text bold color={colorTheme.colors.primary}>
        #{jobDetails?.id || "N/A"}
      </Text>

      <HStack justifyContent="space-between">
        <Text fontSize="xs" color="gray.500">
          {t("FORM.REPAIR.TECHNICIAN_NAME")}
        </Text>
        <Text color={colorTheme.colors.text}>
          {jobDetails.received_by.user_name} {jobDetails.received_by.user_fname}
        </Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text fontSize="xs" color="gray.500">
          {t("RECEIVED_DATE")}
        </Text>
        <Text color={colorTheme.colors.text}>
          {dayJs(`${jobDetails.received_date}`).format("DD MMM YYYY, HH:mm ")}
        </Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text fontSize="xs" color="gray.500">
          {t("PROCESSING_DATE")}
        </Text>
        <Text color={colorTheme.colors.text}>
          {dayJs(`${jobDetails.process_date} ${jobDetails.process_time}`).format("DD MMM YYYY, HH:mm ")}
        </Text>
      </HStack>
      <Text bold color={colorTheme.colors.text}>
        {t("FORM.REPAIR_SUBMIT.SOLUTION")}
      </Text>
      <Box bg="gray.100" p={2} borderRadius="md">
        <Text>{solution || t("FORM.REPAIR_SUBMIT.NO_SOLUTION")}</Text>
      </Box>

      {images.length > 0 && <ImagePreview images={images} />}
    </VStack>
  );
};

export default RepairSubmitView;
