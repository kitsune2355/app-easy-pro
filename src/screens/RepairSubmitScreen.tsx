import React, { useEffect, useState } from "react";
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
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchAllRepairs } from "../service/repairService";
import { IRepair } from "../interfaces/repair.interface";

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
  const { repairs } = useSelector((state: any) => state.repair);

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const [selectedRepairDetails, setSelectedRepairDetails] =
    useState<IRepair | null>(null);
  const [solution, setSolution] = useState<string>("");

  useEffect(() => {
    dispatch(fetchAllRepairs());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRepairId) {
      const foundRepair = repairs.find(
        (repair: IRepair) => repair.id === selectedRepairId
      );
      if (foundRepair) {
        setSelectedRepairDetails(foundRepair);
      }
    } else {
      setSelectedRepairDetails(null);
    }
  }, [selectedRepairId, repairs, dispatch]);

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
      const newImages = [...images, uri];
      setImages(newImages);
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
      const newImages = [...images, ...uris];
      setImages(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleNext = () => {
    if (step === 1 && !selectedRepairId) {
      Alert.alert("Required", "Please select a repair job ID to proceed.");
      return;
    }
    if (step === 2 && !solution.trim()) {
      Alert.alert("Required", "Please provide details of the repair solution.");
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedRepairId || !selectedRepairDetails) {
      Alert.alert(
        `${t('ALERT.ERROR')}`,
        `${t('ALERT.MISSING_REPAIR_DESC')}`
      );
      return;
    }
    if (!solution.trim()) {
      Alert.alert(`${t('ALERT.REQ_TXT')}`, `${t('ALERT.PLS_DESC_SOLUTION')}`);
      return;
    }
    if (images.length === 0) {
      Alert.alert(`${t('ALERT.REQ_TXT')}`, `${t('ALERT.PLS_UPLOAD_AT_LEAST_ONE_IMG')}`);
      return;
    }

    try {
      console.log("Submitting:", {
        repairId: selectedRepairId,
        solution: solution,
        images: images,
      });

      Alert.alert(`${t('SUBMIT_WORK')}`, `${t('WORK_SUBMISSION.SUCCESS_MESSAGE')}`);
      setStep(1);
      setImages([]);
      setSelectedRepairId(null);
      setSelectedRepairDetails(null);
      setSolution("");
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "Failed to submit repair. Please try again.");
    }
  };

  return (
    <>
      <AppHeader
        title={t("MENU.SUBMIT_REPAIR_REQ")}
        bgColor={colorTheme.colors.primary}
        textColor="white"
      />
      <VStack flex={1} p={4} space={2} safeAreaBottom>
        <StepIndicator
          customStyles={stepStyles}
          currentPosition={step - 1}
          labels={labels.map(label => t(label))}
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
                solution={solution}
                onSolutionChange={setSolution}
              />
            )}
            {step === 3 && (
              <RepairSubmitView
                images={images}
                jobDetails={selectedRepairDetails}
                solution={solution}
              />
            )}
          </ScreenWrapper>

          <VStack space={2} p={4}>
            {step > 1 && (
              <Button variant="outline" onPress={handleBack}>
                {t('BTN_CONTROL.PREVIOUS')}
              </Button>
            )}
            {step < 3 ? (
              <Button
                flexGrow={1}
                bg={colorTheme.colors.primary}
                _text={{ color: "white", fontWeight: "bold" }}
                onPress={handleNext}
              >
                {t('BTN_CONTROL.NEXT')}
              </Button>
            ) : (
              <Button
                bg="emerald.500"
                _text={{ color: "white", fontWeight: "bold" }}
                onPress={handleSubmit}
              >
                {t('SUBMIT_WORK')}
              </Button>
            )}
          </VStack>
        </VStack>
      </VStack>
    </>
  );
};

export default RepairSubmitScreen;
