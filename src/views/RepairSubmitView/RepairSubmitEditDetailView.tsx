import {
  Actionsheet,
  Button,
  FormControl,
  Icon,
  TextArea,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import ImagePreview from "../../components/ImagePreview";

interface RepairSubmitEditDetailViewProps {
  images: string[];
  onCamera: () => void;
  onGallery: () => void;
  onRemoveImage: (index: number) => void;
  solution: string;
  onSolutionChange: (text: string) => void;
}

const RepairSubmitEditDetailView: React.FC<RepairSubmitEditDetailViewProps> = ({
  images,
  onCamera,
  onGallery,
  onRemoveImage,
  solution,
  onSolutionChange,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const [showImagePickerSheet, setShowImagePickerSheet] = useState(false);

  return (
    <VStack space={4}>
      <FormControl isRequired>
        <FormControl.Label>{t('FORM.REPAIR_SUBMIT.SOLUTION_DESC')}</FormControl.Label>
        <TextArea
          value={solution}
          onChangeText={onSolutionChange}
          placeholder={t('FORM.REPAIR_SUBMIT.SOLUTION_DESC_PLACEHOLDER')}
          autoCompleteType={undefined}
          tvParallaxProperties={undefined}
          onTextInput={undefined}
        />
      </FormControl>
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
              onCamera();
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
              onGallery();
            }}
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