import { Box, HStack, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import ImagePreview from "../../components/ImagePreview";
import { IRepair } from "../../interfaces/repair.interface";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { dayJs } from "../../config/dayJs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchJobTypeById, fetchServiceTypeById } from "../../service/repairService";

interface RepairSubmitViewProps {
  images: string[];
  jobDetails: IRepair | null;
  solution: string;
  serviceType: string;
  jobType: string;
}

const RepairSubmitView: React.FC<RepairSubmitViewProps> = ({
  images,
  jobDetails,
  solution,
  serviceType,
  jobType,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const { serviceType: serviceTypeData, jobType: jobTypeData } = useSelector((state: RootState) => state.repair);

  useEffect(() => {
    dispatch(fetchServiceTypeById(serviceType));
    dispatch(fetchJobTypeById(jobType));
  }, [dispatch, serviceType, jobType]);

  return (
    <VStack space={2}>
      <Text bold fontSize="md" color={colorTheme.colors.text}>
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
          {dayJs(
            `${jobDetails.process_date} ${jobDetails.process_time}`
          ).format("DD MMM YYYY, HH:mm ")}
        </Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text fontSize="xs" color="gray.500">
          {t("FORM.REPAIR_SUBMIT.SOLUTION_SERVICE_TYPE")}
        </Text>
        <Text color={colorTheme.colors.text}>{serviceTypeData[0].rpg_name}</Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text fontSize="xs" color="gray.500">
          {t("FORM.REPAIR_SUBMIT.SOLUTION_JOB_TYPE")}
        </Text>
        <Text color={colorTheme.colors.text}>{jobTypeData[0].rps_name}</Text>
      </HStack>

      <Text bold color={colorTheme.colors.text}>
        {t("FORM.REPAIR_SUBMIT.SOLUTION")}
      </Text>
      <Box bg={colorTheme.colors.border} p={2} borderRadius="md">
        <Text color={colorTheme.colors.text}>
          {solution || t("FORM.REPAIR_SUBMIT.NO_SOLUTION")}
        </Text>
      </Box>

      {images.length > 0 && <ImagePreview images={images} />}
    </VStack>
  );
};

export default RepairSubmitView;
