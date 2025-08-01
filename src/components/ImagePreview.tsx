import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, ScrollView, HStack, Image, Icon, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import ImageViewing from "react-native-image-viewing";
import { env } from "../config/environment";

interface ImagePreviewProps {
  images: string[];
  onRemoveImage?: (index: number) => void;
  imageSize?: number;
  showRemoveButton?: boolean;
  noScroll?: boolean;
}

export const BASE_UPLOAD_PATH = `${env.API_ENDPOINT}/uploads/`;
export const BASE_UPLOAD_PATH_COMPLETED = `${env.API_ENDPOINT}/uploads/completed/`;

export const parseImageUrls = (raw: any): string[] => {
  try {
    if (typeof raw === "string") {
      if (!raw.trim()) return [];
      // กรณี string ที่เหมือน array แต่ขาด ] ปิด
      if (raw.trim().startsWith("[") && !raw.trim().endsWith("]")) {
        try {
          const fixed = raw.trim() + "]";
          const parsed = JSON.parse(fixed);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
      // ปกติ
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "string") return [parsed];
      } catch {
        // ถ้า parse ไม่ได้ แปลว่าเป็น path เดี่ยว
        return [raw];
      }
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
  noScroll = false,
}) => {
  const { t } = useTranslation();

  const [isViewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box py={4} alignItems="center">
        <Text color="gray.500">{t("NO_IMAGES_AVAILABLE")}</Text>
      </Box>
    );
  }

  const imageSources = images.map((uri) => ({ uri }));

  const ImageContent = (
    <>
      {images.map((uri, index) => (
        <Box key={index} m={1}>
          <TouchableOpacity
            onPress={() => {
              setSelectedIndex(index);
              setViewerVisible(true);
            }}
          >
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
          </TouchableOpacity>
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
              <Icon as={MaterialIcons} name="close" size="4" color="white" />
            </TouchableOpacity>
          )}
        </Box>
      ))}
    </>
  );

  return (
    <Box mt="3">
      {noScroll ? (
        <HStack flexWrap="wrap">{ImageContent}</HStack>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack>{ImageContent}</HStack>
        </ScrollView>
      )}

      <ImageViewing
        images={imageSources}
        imageIndex={selectedIndex}
        visible={isViewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </Box>
  );
};

export default ImagePreview;
