import {
  Actionsheet,
  Button,
  FormControl,
  Icon,
  TextArea,
  Text,
  VStack,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import ImagePreview from "../../components/ImagePreview";
import Select from "../../components/Select";
import { Controller } from "react-hook-form";
import { useRepairSubmitForm } from "../../hooks/useRepairSubmitForm";
import {
  fetchAllJobType,
  fetchAllServiceType,
} from "../../service/repairService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

interface RepairSubmitEditDetailViewProps {
  images: string[];
  form: ReturnType<typeof useRepairSubmitForm>;
  showImagePickerSheet: boolean;
  onCamera: () => void;
  onGallery: () => void;
  onRemoveImage: (index: number) => void;
  onOpen: () => void;
  onClose: () => void;
}

const RepairSubmitEditDetailView: React.FC<RepairSubmitEditDetailViewProps> = ({
  images,
  form,
  showImagePickerSheet,
  onCamera,
  onGallery,
  onRemoveImage,
  onOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const {
    control,
    formState: { errors },
  } = form;

  const { serviceType, jobType } = useSelector(
    (state: RootState) => state.repair
  );

  useEffect(() => {
    dispatch(fetchAllServiceType());
    dispatch(fetchAllJobType());
  }, [dispatch]);

  return (
    <VStack space={4}>
      <Controller
        control={control}
        name="service_type"
        render={({ field: { onChange, value } }) => (
          <Select
            isRequired
            label={t("FORM.REPAIR_SUBMIT.SOLUTION_SERVICE_TYPE")}
            placeholder={t(
              "FORM.REPAIR_SUBMIT.SOLUTION_SERVICE_TYPE_PLACEHOLDER"
            )}
            value={value}
            onChange={onChange}
            options={serviceType.map((item) => ({
              label: item.rpg_name,
              value: item.rpg_id,
            }))}
          />
        )}
      />
      {errors.service_type && (
        <Text color="red.500">{errors.service_type.message}</Text>
      )}

      <Controller
        control={control}
        name="job_type"
        render={({ field: { onChange, value } }) => (
          <Select
            isRequired
            label={t("FORM.REPAIR_SUBMIT.SOLUTION_JOB_TYPE")}
            placeholder={t("FORM.REPAIR_SUBMIT.SOLUTION_JOB_TYPE_PLACEHOLDER")}
            value={value}
            onChange={onChange}
            options={jobType.map((item) => ({
              label: item.rps_name,
              value: item.rps_id,
            }))}
          />
        )}
      />
      {errors.job_type && (
        <Text color="red.500">{errors.job_type.message}</Text>
      )}

      <Controller
        control={control}
        name="solution"
        render={({ field: { onChange, value } }) => (
          <FormControl isRequired>
            <FormControl.Label>
              <Text color={colorTheme.colors.text}>
                {t("FORM.REPAIR_SUBMIT.SOLUTION_DESC")}
              </Text>
            </FormControl.Label>
            <TextArea
              value={value}
              onChangeText={onChange}
              placeholder={t("FORM.REPAIR_SUBMIT.SOLUTION_DESC_PLACEHOLDER")}
              autoCompleteType={undefined}
              tvParallaxProperties={undefined}
              onTextInput={undefined}
            />
          </FormControl>
        )}
      />
      {errors.solution && (
        <Text color="red.500">{errors.solution.message}</Text>
      )}

      <Button
        variant="outline"
        borderRadius={10}
        borderColor={colorTheme.colors.primary}
        _text={{ color: colorTheme.colors.primary }}
        onPress={onOpen}
      >
        {t("FORM.REPAIR.UPLOAD_IMAGE")}
      </Button>
      <Actionsheet
        isOpen={showImagePickerSheet}
        onClose={onClose}
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
            onPress={onCamera}
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
            onPress={onGallery}
          >
            {t("FORM.REPAIR.PHOTO_LIBRARY")}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      {images.length > 0 && (
        <ImagePreview
          noScroll
          images={images}
          onRemoveImage={(index) => onRemoveImage(index)}
        />
      )}
    </VStack>
  );
};

export default RepairSubmitEditDetailView;
