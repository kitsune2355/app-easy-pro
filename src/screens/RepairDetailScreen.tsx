import React, { useEffect, useState, useMemo } from "react";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import ScreenWrapper from "../components/ScreenWrapper";
import {
  VStack,
  Text,
  Center,
  Icon,
  HStack,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
} from "native-base";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepairById, updateRepairStatus } from "../service/repairService";
import { AppDispatch, RootState } from "../store";
import { getBackgroundColor, statusItems } from "../constant/ConstantItem";
import { Ionicons, FontAwesome } from "react-native-vector-icons";
import { dayJs } from "../config/dayJs";
import ImagePreview, {
  BASE_UPLOAD_PATH,
  parseImageUrls,
} from "../components/ImagePreview";
import { Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import i18n from "../config/il8n";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRepairProcessForm } from "../hooks/useRepairProcessForm";

const RepairDetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const toast = useToast();
  const { repairId } = route.params as { repairId: string };
  const {
    control,
    formState: { errors },
    setValue,
  } = useRepairProcessForm();
  const [accepting, setAccepting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const onFetchRepairsById = async () => {
    try {
      await dispatch(fetchRepairById(repairId));
    } catch (err) {
      console.error("Failed to fetch repair details:", err);
    }
  };

  const handleAcceptWork = async (id: string) => {
    setAccepting(true);
    try {
      const res = await dispatch(updateRepairStatus(id));
      if (res.status === "success") {
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="2" py="1" rounded="full" mb={5}>
                <Text color="white">
                  {t("WORK_ACCEPTANCE.SUCCESS_MESSAGE")} #{id}
                </Text>
              </Box>
            );
          },
        });
      } else {
        toast.show({
          render: () => {
            return (
              <Box bg="red.500" px="2" py="1" rounded="full" mb={5}>
                <Text color="white">{t("WORK_ACCEPTANCE.ERROR_MESSAGE")}</Text>
              </Box>
            );
          },
        });
      }
    } catch (error) {
      console.error("Error updating repair status:", error);
    } finally {
      setAccepting(false);
    }
  };

  useEffect(() => {
    if (repairId) {
      onFetchRepairsById();
    }
  }, [repairId]);

  const renderRepairDetail = () => {
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

  const renderDetailTechnician = () => {
    return (
      <VStack bg={colorTheme.colors.card} rounded="xl" p={4} shadow={1}>
        <Text color={colorTheme.colors.primary} fontSize="lg" fontWeight="bold">
          {t("RES_PERSON")}
        </Text>
        <VStack
          mt={3}
          pt={3}
          borderTopWidth={1}
          borderTopColor={colorTheme.colors.border}
          space={3}
        >
          {/* ข้อมูลช่าง */}
          <HStack space={3}>
            <Icon
              as={FontAwesome}
              name="user"
              size="sm"
              color={colorTheme.colors.text}
            />
            <VStack>
              <Text fontSize="xs" color="gray.500">
                {t("FORM.REPAIR.TECHNICIAN_NAME")}
              </Text>
              <Text color={colorTheme.colors.text}>
                {repairDetail.received_by}
              </Text>
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
              <Text color={colorTheme.colors.text}>
                {repairDetail.received_by_tel}
              </Text>
            </VStack>
          </HStack>

          {/* วันที่รับงาน */}
          <HStack space={3}>
            <Icon
              as={Ionicons}
              name="calendar"
              size="sm"
              color={colorTheme.colors.text}
            />
            <VStack>
              <Text fontSize="xs" color="gray.500">
                {t("RECEIVED_DATE")}
              </Text>
              <Text color={colorTheme.colors.text}>
                {dayJs(repairDetail.received_date).format("DD MMM YYYY, HH:mm")}
              </Text>
            </VStack>
          </HStack>

          {/* เลือกวันดำเนินการ */}
          <HStack space={3} alignItems="flex-start">
            <Icon
              as={Ionicons}
              name="calendar"
              size="sm"
              color={colorTheme.colors.text}
              mt={2}
            />
            <VStack flex={1}>
              <Text fontSize="xs" color="gray.500">
                {t("PROCESSING_DATE")}
              </Text>
              <FormControl isRequired isInvalid={!!errors.process_date}>
                <Controller
                  control={control}
                  name="process_date"
                  render={({
                    field: { value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{ width: "100%" }}
                      >
                        <Input
                          isReadOnly
                          value={
                            value ? dayJs(value).format("DD MMM YYYY") : ""
                          }
                          placeholder={t("FORM.REPAIR.SELECT_DATE")}
                          isInvalid={!!error}
                          borderColor={error ? "#ef4444" : "#d1d5db"}
                          width="100%"
                        />
                      </TouchableOpacity>

                      {showDatePicker && (
                        <DateTimePicker
                          value={value ? new Date(value) : new Date()}
                          mode="date"
                          display="default"
                          locale={i18n.language === "th" ? "th-TH" : "en-US"}
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                              setValue(
                                "process_date",
                                dayJs(selectedDate).format("YYYY-MM-DD")
                              );
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.process_date?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>
          </HStack>

          {/* ถ้าสถานะคือ COMPLETED */}
          {statusItem.text === "COMPLETED" && (
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
                  name="calendar"
                  size="sm"
                  color={colorTheme.colors.text}
                />
                <VStack>
                  <Text fontSize="xs" color="gray.500">
                    {t("DETAIL_OF_SOLUTION")}
                  </Text>
                  <Text color={colorTheme.colors.text}>DETAIL_OF_SOLUTION</Text>
                </VStack>
              </HStack>

              {imagesForPreview.length > 0 && (
                <ImagePreview
                  images={imagesForPreview}
                  showRemoveButton={false}
                />
              )}
            </>
          )}
        </VStack>
      </VStack>
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
            {renderRepairDetail()}
            {statusItem.text !== "PENDING" && renderDetailTechnician()}

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
