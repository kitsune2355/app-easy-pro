import React from "react";
import { HStack, Icon, VStack, Text } from "native-base";
import ImagePreview from "../components/ImagePreview";
import { Ionicons } from "react-native-vector-icons";
import { useTheme } from "../context/ThemeContext";
import { dayJs } from "../config/dayJs";
import { useTranslation } from "react-i18next";
import { IRepair } from "../interfaces/repair.interface";

interface IRepairDetailSummaryViewProps {
  repairDetail: IRepair;
  imagesForPreview: any[];
}

const RepairDetailSummaryView: React.FC<IRepairDetailSummaryViewProps> = ({
  repairDetail,
  imagesForPreview,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  return (
    <>
      <HStack space={3}>
        <Icon
          as={Ionicons}
          name="calendar"
          size="sm"
          color={colorTheme.colors.text}
        />
        <VStack>
          <Text fontSize="xs" color="gray.500">
            {t("COMPLETION_DATE")}
          </Text>
          <Text color={colorTheme.colors.text}>
            {dayJs(
              `${repairDetail.report_date} ${repairDetail.report_time}`
            ).format("DD MMM YYYY, HH:mm ")}
          </Text>
        </VStack>
      </HStack>

      <HStack space={3}>
        <Icon
          as={Ionicons}
          name="document-text"
          size="sm"
          color={colorTheme.colors.text}
        />
        <VStack>
          <Text fontSize="xs" color="gray.500">
            {t("DETAIL_OF_SOLUTION")}
          </Text>
          <Text color={colorTheme.colors.text}></Text>
        </VStack>
      </HStack>

      {imagesForPreview.length > 0 && (
        <ImagePreview images={imagesForPreview} showRemoveButton={false} />
      )}
    </>
  );
};

export default RepairDetailSummaryView;
