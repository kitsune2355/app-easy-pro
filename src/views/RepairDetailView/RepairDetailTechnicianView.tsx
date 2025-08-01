import {
  VStack,
  Text,
  HStack,
  Icon,
  FormControl,
  Input,
  Button,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
} from "react-native-vector-icons";
import { dayJs } from "../../config/dayJs";
import { Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { IRepair } from "../../interfaces/repair.interface";
import { useRepairProcessForm } from "../../hooks/useRepairProcessForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateRepairProcessDate } from "../../service/repairService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useToastMessage } from "../../components/ToastMessage";
import { IRepairProcessForm } from "../../interfaces/form/repairForm";

type StatusItem = {
  icon: string;
  color: string;
  text: string;
};

interface IRepairDetailTechnicianViewProps {
  userRole: 'admin' | 'employer';
  repairDetail: IRepair;
  imagesForPreview: any[];
  statusItem: StatusItem;
}

const RepairDetailTechnicianView: React.FC<
  IRepairDetailTechnicianViewProps
> = ({ userRole, repairDetail, imagesForPreview, statusItem }) => {
  const { showToast } = useToastMessage();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useRepairProcessForm();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const isRequired = watch("process_date") && watch("process_time");

  const onStart = useCallback(() => {
    if (
      repairDetail.process_date &&
      repairDetail.process_date !== "0000-00-00"
    ) {
      setValue("process_date", repairDetail.process_date);
    } else {
      setValue("process_date", "");
    }

    if (repairDetail.process_time && repairDetail.process_time !== "00:00:00") {
      setValue("process_time", repairDetail.process_time);
    } else {
      setValue("process_time", "");
    }
  }, [repairDetail.process_date, repairDetail.process_time, setValue]);

  useEffect(() => {
    onStart();
  }, [onStart]);

  const onProcessDateSubmit = useCallback(
    async (data: IRepairProcessForm) => {
      try {
        const res = await dispatch(
          updateRepairProcessDate(
            repairDetail.id,
            data.process_date,
            data.process_time
          )
        );

        if (res.status === "success") {
          showToast("success", t("COMMON.SAVE"));
        } else if (res.status === "warning") {
          showToast("warning", res.message);
        } else {
          showToast("error", res.message || t("COMMON.SAVE_ERROR"));
        }
      } catch (error) {
        showToast("error", t("COMMON.SAVE_ERROR"));
      }
    },
    [dispatch, repairDetail.id, showToast, t]
  );

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
              {repairDetail.received_by.user_name}{" "}
              {repairDetail.received_by.user_fname}
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
              {repairDetail.received_by_tel || "-"}
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
              {t("RECEIVED_DATE")}
            </Text>
            <Text color={colorTheme.colors.text}>
              {dayJs(repairDetail.received_date).format("DD MMM YYYY, HH:mm")}
            </Text>
          </VStack>
        </HStack>

        <HStack space={3} alignItems="flex-start">
          <Icon
            as={Ionicons}
            name="calendar"
            size="sm"
            color={colorTheme.colors.text}
            mt={2}
          />
          <VStack flex={1} space={1}>
            <Text fontSize="xs" color="gray.500">
              {t("PROCESSING_DATE")}
            </Text>
            {repairDetail.status === "completed" ? (
              <Text color={colorTheme.colors.text}>
                {dayJs(
                  `${repairDetail.process_date} ${repairDetail.process_time}`
                ).format("DD MMM YYYY, HH:mm")}
              </Text>
            ) : (
              <>
                <FormControl isInvalid={!!errors.process_date}>
                  <Controller
                    control={control}
                    name="process_date"
                    render={({ field: { value }, fieldState: { error } }) => (
                      <>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(true)}
                          disabled={userRole !== "admin"}
                        >
                          <Input
                            isReadOnly
                            value={
                              value ? dayJs(value).format("DD MMM YYYY") : ""
                            }
                            placeholder={t("FORM.REPAIR.SELECT_DATE")}
                            isInvalid={!!error}
                            borderColor={error ? "#ef4444" : "#d1d5db"}
                            pointerEvents="none"
                            width="100%"
                            InputLeftElement={
                              <Icon
                                as={<MaterialIcons name="calendar-today" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                            isDisabled={userRole !== "admin"}
                          />
                        </TouchableOpacity>

                        {showDatePicker && (
                          <DateTimePicker
                            value={value ? dayJs(value).toDate() : new Date()}
                            mode="date"
                            display="default"
                            minimumDate={dayJs(repairDetail.received_date)
                              .startOf("day")
                              .toDate()}
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

                <Text fontSize="xs" color="gray.500">
                  {t("PROCESSING_TIME")}
                </Text>
                <FormControl isInvalid={!!errors.process_time}>
                  <Controller
                    control={control}
                    name="process_time"
                    render={({ field: { value }, fieldState: { error } }) => (
                      <>
                        <TouchableOpacity
                          onPress={() => setShowTimePicker(true)}
                          disabled={userRole !== "admin"}
                        >
                          <Input
                            isReadOnly
                            value={
                              value
                                ? dayJs(`2000-01-01T${value}`).format("HH:mm")
                                : ""
                            }
                            placeholder={t("FORM.REPAIR.SELECT_TIME")}
                            isInvalid={!!error}
                            borderColor={error ? "#ef4444" : "#d1d5db"}
                            pointerEvents="none"
                            width="100%"
                            InputLeftElement={
                              <Icon
                                as={<MaterialIcons name="schedule" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                              />
                            }
                            isDisabled={userRole !== "admin"}
                          />
                        </TouchableOpacity>

                        {showTimePicker && (
                          <DateTimePicker
                            value={
                              value
                                ? dayJs(`2000-01-01T${value}`).toDate()
                                : new Date()
                            }
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                              setShowTimePicker(false);
                              if (selectedTime) {
                                setValue(
                                  "process_time",
                                  dayJs(selectedTime).format("HH:mm")
                                );
                              }
                            }}
                          />
                        )}
                      </>
                    )}
                  />
                  <FormControl.ErrorMessage>
                    {errors.process_time?.message}
                  </FormControl.ErrorMessage>
                </FormControl>

                {isRequired && userRole === "admin" && repairDetail.status !== "feedback" && (
                  <Button
                    variant="subtle"
                    colorScheme="emerald"
                    size="xs"
                    onPress={handleSubmit(onProcessDateSubmit)}
                  >
                    {t("COMMON.SAVE")}
                  </Button>
                )}
              </>
            )}
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default RepairDetailTechnicianView;
