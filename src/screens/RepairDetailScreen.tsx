import React, { useEffect, useState, useMemo, useCallback } from "react";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import ScreenWrapper from "../components/ScreenWrapper";
import { VStack, Text, Center, Icon, Button } from "native-base";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepairById, updateRepairStatus } from "../service/repairService";
import { AppDispatch, RootState } from "../store";
import { getBackgroundColor, statusItems } from "../constant/ConstantItem";
import ImagePreview, {
  BASE_UPLOAD_PATH,
  parseImageUrls,
} from "../components/ImagePreview";
import { Ionicons } from "react-native-vector-icons";
import RepairInfoView from "../views/RepairDetailView/RepairDetailView";
import RepairDetailTechnicianView from "../views/RepairDetailView/RepairDetailTechnicianView";
import { useToastMessage } from "../components/ToastMessage";
import RepairDetailSummaryView from "../views/RepairDetailView/RepairDetailSummaryView";

const RepairDetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { showToast } = useToastMessage();
  const { repairId } = route.params as { repairId: string };
  const [accepting, setAccepting] = useState(false);

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

  const onFetchRepairsById = useCallback(async () => {
    try {
      await dispatch(fetchRepairById(repairId));
    } catch (err) {
      console.error("Failed to fetch repair details:", err);
    }
  }, [dispatch, repairId]);

  const handleAcceptWork = useCallback(async (id: string) => {
    setAccepting(true);
    try {
      const res = await dispatch(updateRepairStatus(id, "inprogress"));
      if (res.status === "success") {
        showToast("success", `${t("WORK_ACCEPTANCE.SUCCESS_MESSAGE")} #${id}`);
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
      <ScreenWrapper>
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
              <Text color={statusItem.color} fontSize="2xl" fontWeight="bold">
                {t(`PROCESS.${statusItem.text}`)}
              </Text>
            </VStack>

            {repairDetail.status === "pending" && (
              <Button
                variant="solid"
                rounded="xl"
                size="sm"
                shadow={1}
                bg={statusItem.color}
                _text={{ color: "white", fontWeight: "bold" }}
                isLoading={accepting}
                onPress={() => handleAcceptWork(repairDetail.id)}
              >
                {t("ACCEPT_WORK")}
              </Button>
            )}
            <RepairInfoView
              imagesForPreview={imagesForPreview}
              repairDetail={repairDetail}
            />
            {statusItem.text !== "PENDING" && (
              <RepairDetailTechnicianView
                imagesForPreview={imagesForPreview}
                repairDetail={repairDetail}
                statusItem={statusItem}
              />
            )}

            {statusItem.text === "COMPLETED" && (
              <RepairDetailSummaryView
                imagesForPreview={imagesForPreview}
                repairDetail={repairDetail}
              />
            )}

            {repairDetail.status === "inprogress" && (
              <Button
                variant="solid"
                rounded="xl"
                size="sm"
                shadow={1}
                bg={statusItem.color}
                _text={{ color: "white", fontWeight: "bold" }}
                isDisabled={repairDetail.status === "completed"}
              >
                {t("SUBMIT_WORK")}
              </Button>
            )}
          </VStack>
        )}
      </ScreenWrapper>
    </>
  );
};

export default RepairDetailScreen;
