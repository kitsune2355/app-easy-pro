import React, { useCallback, useEffect, useState } from "react";
import { Button, VStack } from "native-base";
import * as ImagePicker from "expo-image-picker";
import StepIndicator from "react-native-step-indicator";
import AppHeader from "../components/AppHeader";
import ScreenWrapper from "../components/ScreenWrapper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import RepairSubmitDetailView from "../views/RepairSubmitView/RepairSubmitDetailView";
import RepairSubmitEditDetailView from "../views/RepairSubmitView/RepairSubmitEditDetailView";
import RepairSubmitView from "../views/RepairSubmitView/RepairSubmitView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchAllRepairs, completeRepair } from "../service/repairService";
import { IRepair } from "../interfaces/repair.interface";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RepairSubmitScreenRouteProp } from "../interfaces/navigation/navigationParamsList.interface";
import { useAlertDialog } from "../components/AlertDialogComponent";
import { fetchUserById } from "../service/userService";
import { useRepairSubmitForm } from "../hooks/useRepairSubmitForm";

const labels = [
  "FORM.REPAIR_SUBMIT.STEP_LABELS.1",
  "FORM.REPAIR_SUBMIT.STEP_LABELS.2",
  "FORM.REPAIR_SUBMIT.STEP_LABELS.3",
];

const stepStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#006B9F",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#006B9F",
  stepStrokeUnFinishedColor: "#d3d3d3",
  separatorFinishedColor: "#006B9F",
  separatorUnFinishedColor: "#d3d3d3",
  stepIndicatorFinishedColor: "#006B9F",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#006B9F",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#ffffff",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#006B9F",
};

const RepairSubmitScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const route = useRoute<RepairSubmitScreenRouteProp>();
  const { repairs } = useSelector((state: any) => state.repair);
  const { user } = useSelector((state: RootState) => state.auth);
  const { showAlertDialog, AlertDialogComponent } = useAlertDialog();
  const form = useRepairSubmitForm();
  const { getValues, handleSubmit, reset } = form;

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(
    route?.params?.repairId ?? null
  );
  const [selectedRepairDetails, setSelectedRepairDetails] =
    useState<IRepair | null>(null);
  const [showImagePickerSheet, setShowImagePickerSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFetchAllRepairs = useCallback(() => {
    dispatch(fetchAllRepairs());
  }, [dispatch]);

  useFocusEffect(onFetchAllRepairs);

  useEffect(() => {
    if (selectedRepairId) {
      const found = repairs.find((r: IRepair) => r.id === selectedRepairId);
      setSelectedRepairDetails(found ?? null);
    } else {
      setSelectedRepairDetails(null);
    }
  }, [selectedRepairId, repairs]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  }, []);

  const handleOpenImagePickerSheet = useCallback(() => {
    setShowImagePickerSheet(true);
  }, []);

  const handleCloseImagePickerSheet = useCallback(() => {
    setShowImagePickerSheet(false);
  }, []);

  const handleCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      showAlertDialog(
        `${t("ALERT.REQ_PERMISSION_CAMERA")}`,
        `${t("ALERT.CAMERA_NEED")}`
      );
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
    }
    handleCloseImagePickerSheet();
  };

  const handleGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      showAlertDialog(
        `${t("ALERT.REQ_PERMISSION_CAMERA")}`,
        `${t("ALERT.GALLERY_NEED")}`
      );
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
    }
    handleCloseImagePickerSheet();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Validate แต่ละ step
  const handleNext = () => {
    if (step === 1 && !selectedRepairId) {
      showAlertDialog(
        t("ALERT.REQ_TXT"),
        t("ALERT.PLS_SELECT_ID_TO_PROCEED"),
        "warning"
      );
      return;
    }
    if (step === 2) {
      if (!getValues("service_type")?.trim()) {
        showAlertDialog(
          t("ALERT.REQ_TXT"),
          t("ALERT.PLS_SELECT_SERVICE_TYPE"),
          "warning"
        );
        return;
      }
      if (!getValues("job_type")?.trim()) {
        showAlertDialog(
          t("ALERT.REQ_TXT"),
          t("ALERT.PLS_SELECT_JOB_TYPE"),
          "warning"
        );
        return;
      }
      if (!getValues("solution")?.trim()) {
        showAlertDialog(
          t("ALERT.REQ_TXT"),
          t("ALERT.PLS_PROVIDE_DETAILS"),
          "warning"
        );
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true); // เริ่ม loading
    if (!selectedRepairId || !selectedRepairDetails) {
      showAlertDialog(
        t("ALERT.ERROR"),
        t("ALERT.MISSING_REPAIR_DESC"),
        "warning"
      );
      setIsSubmitting(false); // หยุด loading
      return;
    }
    try {
      const result = await dispatch(
        completeRepair({
          repair_request_id: selectedRepairId,
          completed_solution: data.solution,
          service_type: data.service_type,
          job_type: data.job_type,
          completed_by: user.id,
          completed_image_urls: images,
        })
      );
      if (result.status === "success") {
        showAlertDialog(
          t("SUBMIT_WORK"),
          t("WORK_SUBMISSION.SUCCESS_MESSAGE"),
          "success"
        );
        setStep(1);
        setImages([]);
        setSelectedRepairId(null);
        setSelectedRepairDetails(null);
        reset();
      } else {
        showAlertDialog("Error", result.message, "error");
      }
    } catch (error: any) {
      showAlertDialog("Error", error.message, "error");
    }
    setIsSubmitting(false); // หยุด loading ทุกกรณี
  };

  return (
    <>
      <AppHeader
        title={t("MENU.SUBMIT_REPAIR_REQ")}
        bgColor={colorTheme.colors.main}
        textColor="white"
      />
      <VStack flex={1} p={4} space={2} safeAreaBottom>
        <StepIndicator
          customStyles={stepStyles}
          currentPosition={step - 1}
          // labels={labels.map((label) => t(label))}
          stepCount={3}
        />
        <VStack
          flexGrow={1}
          bg={colorTheme.colors.card}
          rounded="md"
          shadow={2}
        >
          <ScreenWrapper>
            {step === 1 && (
              <RepairSubmitDetailView
                repairs={repairs}
                selectedJobId={selectedRepairId}
                onSelectJobId={setSelectedRepairId}
                jobDetails={selectedRepairDetails}
              />
            )}
            {step === 2 && (
              <RepairSubmitEditDetailView
                images={images}
                onCamera={handleCamera}
                onGallery={handleGallery}
                onRemoveImage={handleRemoveImage}
                form={form}
                showImagePickerSheet={showImagePickerSheet}
                onOpen={handleOpenImagePickerSheet}
                onClose={handleCloseImagePickerSheet}
              />
            )}
            {step === 3 && (
              <RepairSubmitView
                images={images}
                jobDetails={selectedRepairDetails}
                solution={getValues("solution")}
                serviceType={getValues("service_type")}
                jobType={getValues("job_type")}
              />
            )}
          </ScreenWrapper>

          <VStack space={2} p={4}>
            {step > 1 && (
              <Button
                variant="outline"
                _text={{ color: colorTheme.colors.text, fontWeight: "bold" }}
                onPress={handleBack}
              >
                {t("BTN_CONTROL.PREVIOUS")}
              </Button>
            )}
            {step < 3 ? (
              <Button
                flexGrow={1}
                bg={colorTheme.colors.main}
                _text={{ color: "white", fontWeight: "bold" }}
                isDisabled={!selectedRepairId || !selectedRepairDetails}
                onPress={handleNext}
              >
                {t("BTN_CONTROL.NEXT")}
              </Button>
            ) : (
              <Button
                bg="emerald.500"
                _text={{ color: "white", fontWeight: "bold" }}
                onPress={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
              >
                {t("SUBMIT_WORK")}
              </Button>
            )}
          </VStack>
        </VStack>
      </VStack>

      <AlertDialogComponent />
    </>
  );
};

export default RepairSubmitScreen;
