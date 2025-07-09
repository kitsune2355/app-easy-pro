import { VStack, Text, HStack, Icon } from "native-base";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Ionicons, FontAwesome } from "react-native-vector-icons";
import { dayJs } from "../../config/dayJs";
import ImagePreview from "../../components/ImagePreview";
import { IRepair } from "../../interfaces/repair.interface";

interface RepairDetailViewProps {
  repairDetail: IRepair;
  imagesForPreview: any[];
}

const RepairDetailView: React.FC<RepairDetailViewProps> = ({
  repairDetail,
  imagesForPreview,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  return (
    <VStack bg={colorTheme.colors.card} rounded="xl" p={4} shadow={1}>
      <Text color={colorTheme.colors.primary} fontSize="lg" fontWeight="bold">
        {t("FORM.REPAIR.REPORT_INFO")}
      </Text>
      <VStack
        mt={3}
        pt={3}
        borderTopWidth={1}
        borderTopColor={colorTheme.colors.border}
        space={3}
      >
        <HStack space={3}>
          <Icon
            as={FontAwesome}
            name="user"
            size="sm"
            color={colorTheme.colors.text}
          />
          <VStack>
            <Text fontSize="xs" color="gray.500">
              {t("FORM.REPAIR.NAME")}
            </Text>
            <Text color={colorTheme.colors.text}>{repairDetail.name}</Text>
          </VStack>
        </HStack>

        <HStack space={3}>
          <Icon
            as={FontAwesome}
            name="phone"
            size="sm"
            color={colorTheme.colors.text}
          />
          <VStack>
            <Text fontSize="xs" color="gray.500">
              {t("FORM.REPAIR.PHONE")}
            </Text>
            <Text color={colorTheme.colors.text}>{repairDetail.phone}</Text>
          </VStack>
        </HStack>

        <HStack space={3}>
          <Icon
            as={FontAwesome}
            name="file-text"
            size="sm"
            color={colorTheme.colors.text}
          />
          <VStack>
            <Text fontSize="xs" color="gray.500">
              {t("FORM.REPAIR.PROBLEM_DETAILS")}
            </Text>
            <Text color={colorTheme.colors.text} flex={1}>
              {repairDetail.problem_detail}
            </Text>
          </VStack>
        </HStack>

        <HStack space={3}>
          <Icon
            as={FontAwesome}
            name="map-marker"
            size="sm"
            color={colorTheme.colors.text}
          />
          <VStack>
            <Text fontSize="xs" color="gray.500">
              {t("FORM.REPAIR.LOCATION_INFO")}
            </Text>
            <Text color={colorTheme.colors.text}>
              {repairDetail.building}
              {" "}
              {repairDetail.floor}
              {" "}
              {repairDetail.room}
            </Text>
          </VStack>
        </HStack>

        <HStack space={3}>
          <Icon
            as={Ionicons}
            name="calendar"
            size="sm"
            color={colorTheme.colors.text}
          />
          <VStack>
            <Text fontSize="xs" color="gray.500">
              {t("FORM.REPAIR.REPORT_DATE")}
            </Text>
            <Text color={colorTheme.colors.text}>
              {dayJs(
                `${repairDetail.report_date} ${repairDetail.report_time}`
              ).format("DD MMM YYYY, HH:mm ")}
            </Text>
          </VStack>
        </HStack>

        {imagesForPreview.length > 0 && (
          <ImagePreview images={imagesForPreview} showRemoveButton={false} />
        )}
      </VStack>
    </VStack>
  );
};

export default RepairDetailView;
