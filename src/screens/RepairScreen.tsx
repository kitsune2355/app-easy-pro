import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import AppHeader from "../components/AppHeader";
import { VStack, Text, FormControl, Button } from "native-base";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRepairForm } from "../hooks/useRepairForm";
import { IRepairForm } from "../interfaces/form/repairForm";
import { Controller } from "react-hook-form";
import { dayJs, setDayJsLocale } from "../config/dayJs";

const RepairScreen = () => {
  const { t, i18n } = useTranslation();
  const { colorTheme } = useTheme();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useRepairForm();
  const currentLanguage = i18n.language;

  useEffect(() => {
      setDayJsLocale(currentLanguage);
      
    if (!getValues("report_date")) {
      setValue("report_date", dayJs().format("YYYY-MM-DD"));
    }
    if (!getValues("report_time")) {
      setValue("report_time", dayJs().format("HH:mm"));
    }
  }, [setValue, getValues, currentLanguage]);

  const onSubmit = (data: IRepairForm) => {
    console.log("Form Data:", data);
    alert("Form Submitted! Check console for data.");
  };

  const getInputStyle = (hasError: boolean) => ({
    ...styles.input,
    borderColor: hasError ? "#ef4444" : "#d1d5db",
    color: colorTheme.colors.text,
    backgroundColor: colorTheme.colors.card,
  });

  // Style สำหรับ TextArea
  const getTextAreaStyle = (hasError: boolean) => ({
    ...styles.textArea,
    borderColor: hasError ? "#ef4444" : "#d1d5db",
    color: colorTheme.colors.text,
    backgroundColor: colorTheme.colors.card,
  });

  return (
    <React.Fragment>
      <AppHeader
        title={t("MENU.REPAIR_REQ")}
        bgColor={colorTheme.colors.card}
      />
      <ScreenWrapper>
        <VStack bg={colorTheme.colors.background}>
          <VStack space={3}>
            {/* Report Information Section */}
            <Text fontSize="md" fontWeight="bold">
              {t("FORM.REPORT_INFO")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
              {/* Report Date */}
              <FormControl isInvalid={!!errors.report_date}>
                <FormControl.Label>
                  <Text>{t("FORM.REPORT_DATE")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="report_date"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <View pointerEvents="none">
                          <TextInput
                            value={
                              value ? dayJs(value).format("DD MMM YYYY") : ""
                            }
                            editable={false}
                            placeholder={t("FORM.SELECT_DATE")}
                            style={getInputStyle(!!error)}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={date}
                          mode="date"
                          display="default"
                          locale={i18n.language === 'th' ? 'th-TH' : 'en-US'}
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                              setDate(selectedDate);
                              setValue(
                                "report_date",
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
                  {errors.report_date?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Report Time */}
              <FormControl isInvalid={!!errors.report_time}>
                <FormControl.Label>
                  <Text>{t("FORM.REPORT_TIME")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="report_time"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                        <View pointerEvents="none">
                          <TextInput
                            value={value}
                            editable={false}
                            placeholder={t("FORM.SELECT_TIME")}
                            style={getInputStyle(!!error)}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                      </TouchableOpacity>
                      {showTimePicker && (
                        <DateTimePicker
                          value={time}
                          mode="time"
                          is24Hour={true}
                          display="default"
                          locale={currentLanguage}
                          onChange={(event, selectedTime) => {
                            setShowTimePicker(false);
                            if (selectedTime) {
                              setTime(selectedTime);
                              setValue(
                                "report_time",
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
                  {errors.report_time?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Name */}
              <FormControl isInvalid={!!errors.name}>
                <FormControl.Label>
                  <Text>{t("FORM.NAME")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="name"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder={t("FORM.NAME_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={getInputStyle(!!error)}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.name?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Phone */}
              <FormControl isInvalid={!!errors.phone}>
                <FormControl.Label>
                  <Text>{t("FORM.PHONE")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder={t("FORM.PHONE_PLACEHOLDER")}
                      keyboardType="phone-pad"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={getInputStyle(!!error)}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.phone?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            {/* Location Information Section */}
            <Text fontSize="md" fontWeight="bold" mt="5">
              {t("FORM.LOCATION_INFO")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
              {/* Building */}
              <FormControl isInvalid={!!errors.building}>
                <FormControl.Label>
                  <Text>{t("FORM.BUILDING")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="building"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder={t("FORM.BUILDING_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={getInputStyle(!!error)}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.building?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Floor */}
              <FormControl isInvalid={!!errors.floor}>
                <FormControl.Label>
                  <Text>{t("FORM.FLOOR")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="floor"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder={t("FORM.FLOOR_PLACEHOLDER")}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={getInputStyle(!!error)}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.floor?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Room */}
              <FormControl isInvalid={!!errors.room}>
                <FormControl.Label>
                  <Text>{t("FORM.ROOM")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="room"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder={t("FORM.ROOM_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={getInputStyle(!!error)}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.room?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            {/* Description and Image Section */}
            <Text fontSize="md" fontWeight="bold" mt="5">
              {t("FORM.PROBLEM_DETAILS")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
              {/* Description */}
              <FormControl isInvalid={!!errors.desc}>
                <FormControl.Label>
                  <Text>{t("FORM.DESCRIPTION")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="desc"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder={t("FORM.DESCRIPTION_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                      numberOfLines={4}
                      style={getTextAreaStyle(!!error)}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.desc?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Image URL */}
              <FormControl isInvalid={!!errors.imgUrl}>
                <FormControl.Label>
                  <Text>{t("FORM.IMAGE_URL")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="imgUrl"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder={t("FORM.IMAGE_URL_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={getInputStyle(!!error)}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.imgUrl?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            {/* Submit Button */}
            <Button
              mt="5"
              mb="10"
              rounded="2xl"
              bg={colorTheme.colors.primary}
              _text={{ color: "white" }}
              onPress={handleSubmit(onSubmit)}
            >
              {t("FORM.SUBMIT")}
            </Button>
          </VStack>
        </VStack>
      </ScreenWrapper>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    textAlignVertical: "top",
    backgroundColor: "#ffffff",
  },
});

export default RepairScreen;
