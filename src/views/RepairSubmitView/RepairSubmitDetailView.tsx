import React, { useMemo } from "react";
import {
  CheckIcon,
  Divider,
  FormControl,
  HStack,
  Select,
  Text,
  VStack,
} from "native-base";
import { IRepair } from "../../interfaces/repair.interface";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { dayJs } from "../../config/dayJs";
import ImagePreview, {
  BASE_UPLOAD_PATH,
  parseImageUrls,
} from "../../components/ImagePreview";

interface RepairSubmitDetailViewProps {
  repairs: IRepair[];
  selectedJobId: string | null;
  onSelectJobId: (jobId: string) => void;
  jobDetails: IRepair | null;
}

const RepairSubmitDetailView: React.FC<RepairSubmitDetailViewProps> = ({
  repairs,
  selectedJobId,
  onSelectJobId,
  jobDetails,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  const imagesForPreview = useMemo(() => {
    return parseImageUrls(jobDetails?.image_url).map(
      (path: string) => BASE_UPLOAD_PATH + path.replace(/\\/g, "/")
    );
  }, [jobDetails?.image_url]);

  return (
    <VStack space={4}>
      <FormControl isRequired>
        <FormControl.Label>
          {t("FORM.REPAIR_SUBMIT.STEP_LABELS.1")}
        </FormControl.Label>
        <Select
          selectedValue={selectedJobId || undefined}
          onValueChange={(value) => {
            onSelectJobId(value);
          }}
          placeholder={t("FORM.REPAIR_SUBMIT.SELECT_JOB_ID")}
          _selectedItem={{ bg: "blue.100", endIcon: <CheckIcon size={5} /> }}
        >
          {repairs
            .filter(
              (item) =>
                item.status === "inprogress" &&
                item.process_date &&
                item.process_time
            )
            .map((repair) => (
              <Select.Item
                key={repair.id}
                label={repair.id}
                value={repair.id}
              />
            ))}
        </Select>
      </FormControl>
      {jobDetails ? (
        <VStack space={4}>
          <VStack
            space={2}
            p={3}
            borderWidth={1}
            borderColor="gray.300"
            borderRadius="md"
          >
            <Text
              fontSize="md"
              fontWeight="bold"
              color={colorTheme.colors.primary}
            >
              #{jobDetails.id}
            </Text>

            <VStack space={1}>
              <Text fontSize="xs" color={colorTheme.colors.text}>
                {t("FORM.REPAIR.PROBLEM_DETAILS")}
              </Text>
              <Text color={colorTheme.colors.text} flex={1}>
                {jobDetails.problem_detail}
              </Text>
            </VStack>
            <Divider />

            <HStack justifyContent="space-between">
              <Text fontSize="xs" color={colorTheme.colors.text}>
                {t("BUILDING")}
              </Text>
              <Text>{jobDetails.building}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="xs" color={colorTheme.colors.text}>
                {t("FLOOR")}
              </Text>
              <Text>{jobDetails.floor || `-`}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="xs" color={colorTheme.colors.text}>
                {t("ROOM")}
              </Text>
              <Text>{jobDetails.room || `-`}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="xs" color={colorTheme.colors.text}>
                {t("FORM.REPAIR.REPORT_DATE")}
              </Text>
              <Text color={colorTheme.colors.text}>
                {dayJs(`${jobDetails.report_date}`).format("DD MMM YYYY ")}
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize="xs" color={colorTheme.colors.text}>
                {t("FORM.REPAIR.REPORT_TIME")}
              </Text>
              <Text color={colorTheme.colors.text}>
                {dayJs(
                  `${jobDetails.report_date} ${jobDetails.report_time}`
                ).format("HH:mm ")}
              </Text>
            </HStack>
          </VStack>

          <VStack
            space={2}
            p={3}
            borderWidth={1}
            borderColor="gray.300"
            borderRadius="md"
          >
            <ImagePreview images={imagesForPreview} />
          </VStack>
        </VStack>
      ) : null}
    </VStack>
  );
};

export default RepairSubmitDetailView;
