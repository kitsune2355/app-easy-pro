import React from "react";
import { TouchableOpacity } from "react-native";
import { Box, ScrollView, HStack, Image, Icon, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { env } from "../config/environment";


interface ImagePreviewProps {
  images: string[];
  onRemoveImage?: (index: number) => void;
  imageSize?: number;
  showRemoveButton?: boolean;
}

export const BASE_UPLOAD_PATH = `${env.API_ENDPOINT}/uploads/`;

export const parseImageUrls = (raw: any) => {
  try {
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } else if (Array.isArray(raw)) {
      return raw;
    }
  } catch (err) {
    console.warn("Invalid image_url:", err);
  }
  return [];
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemoveImage,
  imageSize = 100,
  showRemoveButton = true,
}) => {
  const { t } = useTranslation();

  if (!images || images.length === 0) {
    return (
      <Box py={4} alignItems="center">
        <Text color="gray.500">{t('NO_IMAGES_AVAILABLE')}</Text>
      </Box>
    );
  }

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
                width={imageSize}
                height={imageSize}
                position="relative"
              >
                <Image
                  source={{ uri: uri.toString() }}
                  alt={`Selected ${index}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
              {showRemoveButton && onRemoveImage && (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "black",
                    borderRadius: 100,
                    padding: 5,
                  }}
                  onPress={() => onRemoveImage(index)}
                >
                  <Icon
                    as={MaterialIcons}
                    name="close"
                    size="4"
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </Box>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default ImagePreview;
