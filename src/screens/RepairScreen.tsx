import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import AppHeader from "../components/AppHeader";
import {
  VStack,
  Text,
  FormControl,
  Button,
  Select,
  CheckIcon,
  Input,
  TextArea,
  Box,
  Actionsheet,
  Icon,
  HStack,
  ScrollView,
  Image,
} from "native-base";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRepairForm } from "../hooks/useRepairForm";
import { IRepairForm } from "../interfaces/form/repairForm";
import { Controller } from "react-hook-form";
import { dayJs, setDayJsLocale } from "../config/dayJs";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const mockBuildings = [
  { label: "Building A", value: "building_a" },
  { label: "Building B", value: "building_b" },
  { label: "Building C", value: "building_c" },
  { label: "Main Building", value: "main_building" },
  { label: "Annex Building", value: "annex_building" },
];

const mockFloors = [
  { label: "Ground Floor", value: "0" },
  { label: "1st Floor", value: "1" },
  { label: "2nd Floor", value: "2" },
  { label: "3rd Floor", value: "3" },
  { label: "4th Floor", value: "4" },
  { label: "5th Floor", value: "5" },
  { label: "6th Floor", value: "6" },
  { label: "7th Floor", value: "7" },
  { label: "8th Floor", value: "8" },
  { label: "9th Floor", value: "9" },
  { label: "10th Floor", value: "10" },
];

const mockRooms = [
  { label: "Room 101", value: "101" },
  { label: "Room 102", value: "102" },
  { label: "Room 103", value: "103" },
  { label: "Room 201", value: "201" },
  { label: "Room 202", value: "202" },
  { label: "Room 203", value: "203" },
  { label: "Conference Room A", value: "conf_a" },
  { label: "Conference Room B", value: "conf_b" },
  { label: "Meeting Room 1", value: "meeting_1" },
  { label: "Meeting Room 2", value: "meeting_2" },
  { label: "Storage Room", value: "storage" },
  { label: "Server Room", value: "server" },
];

const RepairScreen = () => {
  const { t, i18n } = useTranslation();
  const { colorTheme } = useTheme();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [showImagePickerSheet, setShowImagePickerSheet] = useState(false);

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

  const handleCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "Camera access is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setImages((prev) => [...prev, uri]);
      setValue("imgUrl", uri); // ✅ ส่งค่าภาพล่าสุดให้ form
    }
  };

  const handleGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris]);
      setValue("imgUrl", uris[0]); // ✅ เก็บ URI แรกไว้ใน form
    }
  };

  const onSubmit = (data: IRepairForm) => {
    console.log("Form Data:", data);
    // Here you would typically upload the image (if imageUri is not null)
    // to your backend and then submit the form data with the image URL.
    alert("Form Submitted! Check console for data.");
  };

  const renderPreviewImages = () => {
    return (
      <Box mt="3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space={3} my={2}>
            {images.map((uri, index) => (
              <Box key={index}>
                <Box
                  shadow={3}
                  borderRadius="lg"
                  overflow="hidden"
                  width={100}
                  height={100}
                  position="relative"
                >
                  <Image
                    source={{ uri }}
                    alt={`Selected ${index}`}
                    style={{ width: "100%", height: "100%"}}
                  />
                </Box>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "black",
                    borderRadius: 100,
                    padding: 5,
                  }}
                  onPress={() => {
                    const filtered = images.filter((_, i) => i !== index);
                    setImages(filtered);
                    if (filtered.length > 0) {
                      setValue("imgUrl", filtered[0]);
                    } else {
                      setValue("imgUrl", "");
                    }
                  }}
                >
                  <Icon
                    as={MaterialIcons}
                    name="close"
                    size="4"
                    color="white"
                  />
                </TouchableOpacity>
              </Box>
            ))}
          </HStack>
        </ScrollView>
      </Box>
    );
  };

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
              {t("FORM.REPAIR.REPORT_INFO")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
              {/* Report Date */}
              <FormControl isRequired isInvalid={!!errors.report_date}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.REPORT_DATE")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="report_date"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Input
                          isReadOnly
                          value={
                            value ? dayJs(value).format("DD MMM YYYY") : ""
                          }
                          placeholder={t("FORM.REPAIR.SELECT_DATE")}
                          isInvalid={!!error}
                          borderColor={error ? "#ef4444" : "#d1d5db"}
                          pointerEvents="none"
                        />
                      </TouchableOpacity>

                      {showDatePicker && (
                        <DateTimePicker
                          value={date}
                          mode="date"
                          display="default"
                          locale={i18n.language === "th" ? "th-TH" : "en-US"}
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
              <FormControl isRequired isInvalid={!!errors.report_time}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.REPORT_TIME")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="report_time"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <>
                      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                        <Input
                          isReadOnly
                          value={value}
                          placeholder={t("FORM.REPAIR.SELECT_TIME")}
                          isInvalid={!!error}
                          borderColor={error ? "#ef4444" : "#d1d5db"}
                          pointerEvents="none"
                        />
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
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.NAME")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="name"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <Input
                      placeholder={t("FORM.REPAIR.NAME_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      isInvalid={!!error}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />

                <FormControl.ErrorMessage>
                  {errors.name?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Phone */}
              <FormControl isRequired isInvalid={!!errors.phone}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.PHONE")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <Input
                      placeholder={t("FORM.REPAIR.PHONE_PLACEHOLDER")} // Changed placeholder
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      isInvalid={!!error}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                      keyboardType="phone-pad" // Added keyboardType for phone numbers
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
              {t("FORM.REPAIR.LOCATION_INFO")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
              {/* Building */}
              <FormControl isRequired isInvalid={!!errors.building}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.BUILDING")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="building"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      selectedValue={value}
                      accessibilityLabel={t("FORM.REPAIR.BUILDING_PLACEHOLDER")}
                      placeholder={t("FORM.REPAIR.BUILDING_PLACEHOLDER")}
                      _selectedItem={{
                        bg: colorTheme.colors.secondary,
                        endIcon: <CheckIcon size="5" color="teal.600" />,
                      }}
                      mt={1}
                      onValueChange={onChange}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                    >
                      {mockBuildings.map((building) => (
                        <Select.Item
                          key={building.value}
                          label={building.label}
                          value={building.value}
                        />
                      ))}
                    </Select>
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.building?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Floor */}
              <FormControl isRequired isInvalid={!!errors.floor}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.FLOOR")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="floor"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      selectedValue={value}
                      accessibilityLabel={t("FORM.REPAIR.FLOOR_PLACEHOLDER")}
                      placeholder={t("FORM.REPAIR.FLOOR_PLACEHOLDER")}
                      _selectedItem={{
                        bg: colorTheme.colors.secondary,
                        endIcon: <CheckIcon size="5" color="teal.600" />,
                      }}
                      mt={1}
                      onValueChange={onChange}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                    >
                      {mockFloors.map((floor) => (
                        <Select.Item
                          key={floor.value}
                          label={floor.label}
                          value={floor.value}
                        />
                      ))}
                    </Select>
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.floor?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Room */}
              <FormControl isRequired isInvalid={!!errors.room}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.ROOM")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="room"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      selectedValue={value}
                      accessibilityLabel={t("FORM.REPAIR.ROOM_PLACEHOLDER")}
                      placeholder={t("FORM.REPAIR.ROOM_PLACEHOLDER")}
                      _selectedItem={{
                        bg: colorTheme.colors.secondary,
                        endIcon: <CheckIcon size="5" color="teal.600" />,
                      }}
                      mt={1}
                      onValueChange={onChange}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                    >
                      {mockRooms.map((room) => (
                        <Select.Item
                          key={room.value}
                          label={room.label}
                          value={room.value}
                        />
                      ))}
                    </Select>
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.room?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            {/* Description and Image Section */}
            <Text fontSize="md" fontWeight="bold" mt="5">
              {t("FORM.REPAIR.PROBLEM_DETAILS")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
              {/* Description */}
              <FormControl isRequired isInvalid={!!errors.desc}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.DESCRIPTION")}</Text>
                </FormControl.Label>
                <Controller
                  control={control}
                  name="desc"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextArea
                      placeholder={t("FORM.REPAIR.DESCRIPTION_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      isInvalid={!!error}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                      totalLines={4}
                      tvParallaxProperties={undefined}
                      onTextInput={undefined}
                      autoCompleteType={undefined}
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.desc?.message}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* Image Upload */}
              <FormControl isInvalid={!!errors.imgUrl}>
                <FormControl.Label>
                  <Text>{t("FORM.REPAIR.IMAGE_URL")}</Text>
                </FormControl.Label>
                <Button
                  variant="outline"
                  borderRadius={10}
                  borderColor={colorTheme.colors.primary}
                  _text={{ color: colorTheme.colors.primary }}
                  onPress={() => setShowImagePickerSheet(true)}
                >
                  {imageUri
                    ? t("FORM.REPAIR.CHANGE_IMAGE")
                    : t("FORM.REPAIR.UPLOAD_IMAGE")}
                </Button>
                <Actionsheet
                  isOpen={showImagePickerSheet}
                  onClose={() => setShowImagePickerSheet(false)}
                >
                  <Actionsheet.Content>
                    <Actionsheet.Item
                      startIcon={
                        <Icon
                          as={MaterialIcons}
                          name="camera-alt"
                          size="6"
                          color="primary.500"
                        />
                      }
                      onPress={() => {
                        setShowImagePickerSheet(false);
                        handleCamera();
                      }}
                    >
                      {t("FORM.REPAIR.CAMERA")}
                    </Actionsheet.Item>
                    <Actionsheet.Item
                      startIcon={
                        <Icon
                          as={MaterialIcons}
                          name="photo-library"
                          size="6"
                          color="primary.500"
                        />
                      }
                      onPress={() => {
                        setShowImagePickerSheet(false);
                        handleGallery();
                      }}
                    >
                      {t("FORM.REPAIR.PHOTO_LIBRARY")}
                    </Actionsheet.Item>
                  </Actionsheet.Content>
                </Actionsheet>
                {/* Preview images */}
                {images.length > 0 && renderPreviewImages()}
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
              {t("FORM.REPAIR.SUBMIT")}
            </Button>
          </VStack>
        </VStack>
      </ScreenWrapper>
    </React.Fragment>
  );
};

export default RepairScreen;
