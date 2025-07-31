import React, { useEffect, useState, useMemo, useCallback } from "react";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import ScreenWrapper from "../components/ScreenWrapper";
import {
  VStack,
  Text,
  Center,
  Icon,
  Button,
  Skeleton,
  HStack,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepairById, updateRepairStatus } from "../service/repairService";
import { AppDispatch, RootState } from "../store";
import { getBackgroundColor, statusItems } from "../constant/ConstantItem";
import ImagePreview, {
  BASE_UPLOAD_PATH,
  BASE_UPLOAD_PATH_COMPLETED,
  parseImageUrls,
} from "../components/ImagePreview";
import { Ionicons } from "react-native-vector-icons";
import RepairDetailView from "../views/RepairDetailView/RepairDetailView";
import RepairDetailTechnicianView from "../views/RepairDetailView/RepairDetailTechnicianView";
import { useToastMessage } from "../components/ToastMessage";
import RepairDetailSummaryView from "../views/RepairDetailView/RepairDetailSummaryView";
import { useAuth } from "../hooks/useAuth";
import { fetchUserById } from "../service/userService";
import { markNotificationAsRead } from "../service/notifyService";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import RepairDetailFeedbackView from "../views/RepairDetailView/RepairDetailFeedbackView";

const RepairDetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { showToast } = useToastMessage();
  const { repairId } = route.params as { repairId: string };
  const { user } = useAuth();
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  }, []);

  const { repairDetail, loading, error } = useSelector(
    (state: RootState) => state.repair
  );

  const defaultStatus = {
    icon: "help",
    color: "gray.400",
    text: "UNKNOWN",
  };

  const statusItem = useMemo(() => {
    return repairDetail?.status
      ? statusItems[repairDetail.status as keyof typeof statusItems] ||
          defaultStatus
      : defaultStatus;
  }, [repairDetail]);

  const imagesForPreview = useMemo(() => {
    return parseImageUrls(repairDetail?.image_url).map(
      (path: string) => BASE_UPLOAD_PATH + path.replace(/\\/g, "/")
    );
  }, [repairDetail?.image_url]);

  const imagesCompleteForPreview = useMemo(() => {
    return parseImageUrls(repairDetail?.completed_image_urls).map(
      (path: string) => BASE_UPLOAD_PATH_COMPLETED + path.replace(/\\/g, "/")
    );
  }, [repairDetail?.image_url]);

  const onFetchRepairsById = useCallback(async () => {
    try {
      await dispatch(fetchRepairById(repairId));
      await dispatch(markNotificationAsRead(Number(repairId)));
    } catch (err) {
      console.error("Failed to fetch repair details:", err);
    }
  }, [dispatch, repairId]);

  const handleAcceptWork = useCallback(async (id: string, text: string) => {
    setAccepting(true);
    try {
      const res = await dispatch(updateRepairStatus(id, "inprogress"));
      if (res.status === "success") {
        showToast("success", `${t("WORK_ACCEPTANCE.SUCCESS_MESSAGE")} ${text}`);
      } else {
        showToast("error", t("WORK_ACCEPTANCE.ERROR_MESSAGE"));
      }
    } catch (error) {
      console.error("Error updating repair status:", error);
    } finally {
      setAccepting(false);
    }
  }, []);

  useEffect(() => {
    if (repairId) {
      onFetchRepairsById();
    }
  }, [repairId, onFetchRepairsById]);

  const renderSkeleton = () => {
    return (
      <VStack space={3} pb={6}>
        <VStack
          justifyContent="center"
          alignItems="center"
          bg={colorTheme.colors.card}
          rounded="xl"
          p={4}
          shadow={1}
          space={3}
        >
          <Center rounded="full" size="16">
            <Skeleton size="16" rounded="full" />
          </Center>
          <Text fontSize="2xl" fontWeight="bold">
            <Skeleton size="10" w="32" />
          </Text>
        </VStack>
        {user?.role === "admin" && <Skeleton size="8" rounded="xl" w="full" />}
        {Array.from({ length: 3 }).map((_, key) => (
          <VStack
            key={key}
            justifyContent="center"
            alignItems="center"
            bg={colorTheme.colors.card}
            rounded="xl"
            p={4}
            shadow={1}
            space={3}
          >
            {Array.from({ length: 3 }).map((_, key) => (
              <HStack flex={1} key={key} space={2}>
                <Skeleton size="5" rounded="full" />
                <VStack flex={1} space={2}>
                  <Skeleton size="5" w="32" rounded="md" />
                  <Skeleton size="5" w="full" rounded="md" />
                </VStack>
              </HStack>
            ))}
          </VStack>
        ))}
      </VStack>
    );
  };

  return (
    <>
      <AppHeader
        title={
          <Text color={colorTheme.colors.text}>
            {t("MENU.REPAIR_DESC")}{" "}
            <Text color={colorTheme.colors.primary}>
              {repairDetail?.rp_format}
            </Text>
          </Text>
        }
        bgColor={colorTheme.colors.card}
      />
      <ScreenWrapper>
        {loading ? (
          renderSkeleton()
        ) : (
          <>
            {repairDetail && (
              <VStack space={3} pb={6}>
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
                  {repairDetail.feedback?.rating && (
                    <Text bold fontSize="xl" color={colorTheme.colors.primary}>
                      {repairDetail.feedback?.rating}/5
                    </Text>
                  )}
                  <Text
                    color={statusItem.color}
                    fontSize="2xl"
                    fontWeight="bold"
                  >
                    {t(`PROCESS.${statusItem.text}`)}
                  </Text>
                </VStack>

                {repairDetail.status === "completed" &&
                  user?.role !== "admin" && (
                    <RepairDetailFeedbackView repairId={repairDetail.id} />
                  )}

                {repairDetail.status === "pending" &&
                  user?.role === "admin" && (
                    <Button
                      variant="solid"
                      rounded="xl"
                      size="sm"
                      shadow={1}
                      bg={statusItem.color}
                      _text={{ color: "white", fontWeight: "bold" }}
                      isLoading={accepting}
                      onPress={() =>
                        handleAcceptWork(
                          repairDetail.id,
                          repairDetail.rp_format
                        )
                      }
                    >
                      {t("ACCEPT_WORK")}
                    </Button>
                  )}
                <RepairDetailView
                  imagesForPreview={imagesForPreview}
                  repairDetail={repairDetail}
                />
                {statusItem.text !== "PENDING" && (
                  <RepairDetailTechnicianView
                    userRole={user?.role}
                    imagesForPreview={imagesForPreview}
                    repairDetail={repairDetail}
                    statusItem={statusItem}
                  />
                )}

                {statusItem.text === "COMPLETED" && (
                  <RepairDetailSummaryView
                    imagesForPreview={imagesCompleteForPreview}
                    repairDetail={repairDetail}
                  />
                )}

                {repairDetail.status === "inprogress" &&
                  repairDetail.process_date &&
                  repairDetail.process_time && (
                    <Button
                      variant="solid"
                      rounded="xl"
                      size="lg"
                      shadow={1}
                      bg={statusItem.color}
                      _text={{ color: "white", fontWeight: "bold" }}
                      onPress={() =>
                        navigation.navigate("RepairSubmitScreen", {
                          repairId: repairDetail.id,
                        })
                      }
                    >
                      {t("SUBMIT_WORK")}
                    </Button>
                  )}
              </VStack>
            )}
          </>
        )}
      </ScreenWrapper>
    </>
  );
};

export default RepairDetailScreen;
