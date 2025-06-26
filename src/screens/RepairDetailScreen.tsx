import React, { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import ScreenWrapper from "../components/ScreenWrapper";
import { VStack, Text, Center, Icon, HStack, Divider } from "native-base";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepairById } from "../service/repairService";
import { AppDispatch, RootState } from "../store";
import { getBackgroundColor, statusItems } from "../constant/ConstantItem";
import { Ionicons, FontAwesome } from "react-native-vector-icons";
import { dayJs } from "../config/dayJs";
import ImagePreview, {
  BASE_UPLOAD_PATH,
  parseImageUrls,
} from "../components/ImagePreview";

const RepairDetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { repairId } = route.params as { repairId: string };

  const { repairDetail, loading, error } = useSelector(
    (state: RootState) => state.repair
  );

  const defaultStatus = {
    icon: "help",
    color: "gray.400",
    text: "UNKNOWN",
  };

  // Ensure repairDetail exists before accessing its properties
  const statusItem = repairDetail?.status
    ? statusItems[repairDetail.status as keyof typeof statusItems] ||
      defaultStatus
    : defaultStatus;

  const onFetchRepairsById = async () => {
    try {
      await dispatch(fetchRepairById(repairId));
    } catch (err) {
      console.error("Failed to fetch repair details:", err);
    }
  };

  useEffect(() => {
    onFetchRepairsById();
  }, [repairId]);

  const imagesForPreview = parseImageUrls(repairDetail?.image_url).map(
    (path: string) => BASE_UPLOAD_PATH + path.replace(/\\/g, "/")
  );

  const renderRepairDetail = () => {
    return (
      <>
        {repairDetail && (
          <VStack space={3}>
            <VStack
              justifyContent="center"
              alignItems="center"
              bg={colorTheme.colors.card}
              rounded="xl"
              p={4}
              shadow={1}
              space={3}
            >
              <Center
                bg={getBackgroundColor(statusItem.color)}
                rounded="full"
                size="16"
              >
                <Icon
                  as={Ionicons}
                  name={statusItem.icon}
                  size="3xl"
                  color={statusItem.color}
                />
              </Center>
              <Text color={statusItem.color} fontSize="2xl" fontWeight="bold">
                {t(`PROCESS.${statusItem.text}`)}
              </Text>
            </VStack>

            <VStack bg={colorTheme.colors.card} rounded="xl" p={4} shadow={1}>
              <Text
                color={colorTheme.colors.primary}
                fontSize="lg"
                fontWeight="bold"
              >
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
                  <Text color={colorTheme.colors.text}>
                    {repairDetail.name}
                  </Text>
                </HStack>

                <HStack space={3}>
                  <Icon
                    as={FontAwesome}
                    name="phone"
                    size="sm"
                    color={colorTheme.colors.text}
                  />
                  <Text color={colorTheme.colors.text}>
                    {repairDetail.phone}
                  </Text>
                </HStack>

                <HStack space={3}>
                  <Icon
                    as={FontAwesome}
                    name="file-text"
                    size="sm"
                    color={colorTheme.colors.text}
                  />
                  <Text color={colorTheme.colors.text} flex={1}>
                    {repairDetail.problem_detail}
                  </Text>
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
                      {t("BUILDING")} {repairDetail.building}
                    </Text>
                    <Text color={colorTheme.colors.text}>
                      {t("FLOOR")} {repairDetail.floor}
                    </Text>
                    <Text color={colorTheme.colors.text}>
                      {t("ROOM")} {repairDetail.room}
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
                    {dayJs(
                      `${repairDetail.report_date} ${repairDetail.report_time}`
                    ).format("DD MMM YYYY, HH:mm น.")}
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            {imagesForPreview.length > 0 && (
              <VStack bg={colorTheme.colors.card} rounded="xl" p={4} shadow={1}>
                <Text
                  color={colorTheme.colors.primary}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {t("FORM.REPAIR.IMAGE")}
                </Text>
                <Divider my={3} />
                <ImagePreview
                  images={imagesForPreview}
                  showRemoveButton={false}
                />
              </VStack>
            )}
          </VStack>
        )}
      </>
    );
  };

  return (
    <>
      <AppHeader
        title={
          <Text color={colorTheme.colors.text}>
            {t("MENU.REPAIR_DESC")}{" "}
            <Text color={colorTheme.colors.primary}>#{repairDetail?.id}</Text>
          </Text>
        }
        bgColor={colorTheme.colors.card}
      />
      <ScreenWrapper>{renderRepairDetail()}</ScreenWrapper>
    </>
  );
};

export default RepairDetailScreen;
