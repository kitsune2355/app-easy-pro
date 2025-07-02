import {
  VStack,
  Text,
  HStack,
  Icon,
  FormControl,
  Input,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { Ionicons, FontAwesome } from "react-native-vector-icons";
import { dayJs, setDayJsLocale } from "../config/dayJs";
import { Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { IRepair } from "../interfaces/repair.interface";
import { useRepairProcessForm } from "../hooks/useRepairProcessForm";
import i18n from "../config/il8n";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateRepairProcessDate } from "../service/repairService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { useToastMessage } from "../components/ToastMessage";
import { IRepairProcessForm } from "../interfaces/form/repairForm";

type StatusItem = {
  icon: string;
  color: string;
  text: string;
};

interface IRepairDetailTechnicianViewProps {
  repairDetail: IRepair;
  imagesForPreview: any[];
  statusItem: StatusItem;
}

const RepairDetailTechnicianView: React.FC<
  IRepairDetailTechnicianViewProps
> = ({ repairDetail, imagesForPreview, statusItem }) => {
  const { showToast } = useToastMessage();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useRepairProcessForm();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const currentLanguage = i18n.language;

  useEffect(() => {
    setDayJsLocale(currentLanguage);
    
    if (repairDetail.process_date) {
      setValue("process_date", repairDetail.process_date);
    } else if (!getValues("process_date")) {
      setValue("process_date", dayJs().format("YYYY-MM-DD HH:mm:ss"));
    }
  }, [currentLanguage, getValues, setValue, repairDetail.process_date]); 

  const onProcessDateSubmit = useCallback(async (data: IRepairProcessForm) => {
    try {
      const res = await dispatch(
        updateRepairProcessDate(repairDetail.id, data.process_date)
      );

      if (res.status === "success") {
        showToast("success", t("COMMON.SAVE"));
      } else {
        showToast("error", res.message || t("COMMON.SAVE_ERROR"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("error", t("COMMON.SAVE_ERROR"));
    }
  }, [dispatch, repairDetail.id, showToast, t]);

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
          <VStack flex={1}>
            <Text fontSize="xs" color="gray.500">
              {t("PROCESSING_DATE")}
            </Text>
            <FormControl isInvalid={!!errors.process_date}>
              <Controller
                control={control}
                name="process_date"
                render={({ field: { value }, fieldState: { error } }) => (
                  <>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <HStack space={2} alignItems="center">
                        <Input
                          isReadOnly
                          value={
                            value ? dayJs(value).format("DD MMM YYYY") : ""
                          }
                          placeholder={t("FORM.REPAIR.SELECT_DATE")}
                          isInvalid={!!error}
                          borderColor={error ? "#ef4444" : "#d1d5db"}
                          pointerEvents="none"
                          width="90%"
                        />
                        <TouchableOpacity
                          onPress={handleSubmit(onProcessDateSubmit)}
                        >
                          <Icon
                            as={Ionicons}
                            name="checkmark-circle"
                            size="md"
                            color="green.500"
                            fontWeight="bold"
                          />
                        </TouchableOpacity>
                      </HStack>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={value ? dayJs(value).toDate() : new Date()}
                        mode="date"
                        display="default"
                        locale={currentLanguage}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setValue(
                              "process_date",
                              dayJs(selectedDate).format("YYYY-MM-DD HH:mm:ss")
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

      </VStack>
    </VStack>
  );
};

export default RepairDetailTechnicianView;