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
  Spinner,
  Center,
  ChevronDownIcon,
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
import { fetchAllAreas, submitRepairForm } from "../service/repairService";
import { useDispatch, useSelector } from "react-redux";
import ImagePreview from "../components/ImagePreview";
import { AppDispatch, RootState } from "../store";
import {
  getBuildingOptions,
  getFloorOptions,
  getRoomOptions,
} from "../constant/ConstantItem";

const RepairScreen = () => {
  const { t, i18n } = useTranslation();
  const { colorTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { buildings, loading, error } = useSelector(
    (state: RootState) => state.area
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [images, setImages] = useState<string[]>([]);
  const [showImagePickerSheet, setShowImagePickerSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useRepairForm();
  const currentLanguage = i18n.language;

  const selectedBuildingId = watch("building");
  const selectedFloorId = watch("floor");

  const buildingOptions = getBuildingOptions(buildings);
  const floorOptions = getFloorOptions(buildings, selectedBuildingId);
  const roomOptions = getRoomOptions(
    buildings,
    selectedBuildingId,
    selectedFloorId
  );

  useEffect(() => {
    dispatch(fetchAllAreas());
  }, [dispatch]);

  useEffect(() => {
    setDayJsLocale(currentLanguage);

    if (!getValues("report_date")) {
      setValue("report_date", dayJs().format("YYYY-MM-DD"));
    }
    if (!getValues("report_time")) {
      setValue("report_time", dayJs().format("HH:mm"));
    }
    if (!getValues("imgUrl")) {
      setValue("imgUrl", []);
    }
  }, [setValue, getValues, currentLanguage]);

  const handleCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "Camera access is needed");
      setShowImagePickerSheet(false);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      const newImages = [...images, uri];
      setImages(newImages);
      setValue("imgUrl", newImages);
    }
    setShowImagePickerSheet(false);
  };
  const handleGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      setShowImagePickerSheet(false);
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
      const newImages = [...images, ...uris];
      setImages(newImages);
      setValue("imgUrl", newImages);
    }
    setShowImagePickerSheet(false);
  };

  const onSubmit = async (data: IRepairForm) => {
    setIsSubmitting(true);

    try {
      const result = await dispatch(submitRepairForm(data) as any);
      if (result && result.status === "success") {
        Alert.alert(
          t("FORM.REPAIR.SUBMIT_SUCCESS_TITLE"),
          t("FORM.REPAIR.SUBMIT_SUCCESS_DESC"),
          [
            {
              text: t("COMMON.OK"),
              onPress: () => {
                setValue("report_date", dayJs().format("YYYY-MM-DD"));
                setValue("report_time", dayJs().format("HH:mm"));
                setValue("name", "");
                setValue("phone", "");
                setValue("building", "");
                setValue("floor", "");
                setValue("room", "");
                setValue("desc", "");
                setValue("imgUrl", []);
                setImages([]);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          t("FORM.REPAIR.SUBMIT_ERROR_TITLE"),
          t("FORM.REPAIR.SUBMIT_GENERIC_ERROR"),
          [{ text: t("COMMON.OK") }]
        );
      }
    } catch (error: any) {
      console.error("Error submitting repair form:", error);
      Alert.alert(
        t("FORM.REPAIR.SUBMIT_ERROR_TITLE"),
        t("FORM.REPAIR.SUBMIT_NETWORK_ERROR"),
        [{ text: t("COMMON.OK") }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreviewImages = () => {
    return (
      <ImagePreview
        images={images}
        onRemoveImage={(index) => {
          const newImages = [...images];
          newImages.splice(index, 1);
          setImages(newImages);
        }}
      />
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
            <Text fontSize="md" fontWeight="bold">
              {t("FORM.REPAIR.REPORT_INFO")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
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
                      placeholder={t("FORM.REPAIR.PHONE_PLACEHOLDER")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      isInvalid={!!error}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                      keyboardType="phone-pad"
                    />
                  )}
                />
                <FormControl.ErrorMessage>
                  {errors.phone?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <Text fontSize="md" fontWeight="bold" mt="5">
              {t("FORM.REPAIR.LOCATION_INFO")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
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
                      onValueChange={onChange}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                    >
                      {buildingOptions.map((building) => (
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

              <FormControl isInvalid={!!errors.floor}>
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
                      onValueChange={onChange}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                      isDisabled={!selectedBuildingId || floorOptions.length === 0}
                    >
                      {floorOptions.map((floor) => (
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

              <FormControl isInvalid={!!errors.room}>
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
                      onValueChange={onChange}
                      borderColor={error ? "#ef4444" : "#d1d5db"}
                      isDisabled={!selectedFloorId || roomOptions.length === 0}
                    >
                      {roomOptions.map((room) => (
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

            <Text fontSize="md" fontWeight="bold" mt="5">
              {t("FORM.REPAIR.PROBLEM_DETAILS")}
            </Text>
            <VStack
              bg={colorTheme.colors.card}
              borderRadius="3xl"
              p="5"
              space={4}
            >
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
                  {t("FORM.REPAIR.UPLOAD_IMAGE")}
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
                {images.length > 0 && renderPreviewImages()}
                <FormControl.ErrorMessage>
                  {errors.imgUrl?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </VStack>

            <Button
              mt="5"
              mb="10"
              rounded="2xl"
              bg={colorTheme.colors.primary}
              _text={{ color: "white" }}
              onPress={handleSubmit(onSubmit)}
              isDisabled={isSubmitting}
            >
              {t("FORM.REPAIR.SUBMIT")}
            </Button>
          </VStack>
        </VStack>
      </ScreenWrapper>

      {isSubmitting && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={9999}
        >
          <Center flex={1}>
            <VStack space={3} alignItems="center">
              <Spinner size="lg" color="white" />
              <Text color="white" fontSize="md">
                {t("FORM.REPAIR.SUBMITTING")}
              </Text>
            </VStack>
          </Center>
        </Box>
      )}
    </React.Fragment>
  );
};

export default RepairScreen;
