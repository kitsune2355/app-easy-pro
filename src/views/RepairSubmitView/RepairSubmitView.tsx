import { Box, Text, VStack } from "native-base";
import React from "react";
import ImagePreview from "../../components/ImagePreview";
import { IRepair } from "../../interfaces/repair.interface";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

interface RepairSubmitViewProps {
  images: string[];
  jobDetails: IRepair | null;
  solution: string;
}

const RepairSubmitView: React.FC<RepairSubmitViewProps> = ({
  images,
  jobDetails,
  solution,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  return (
    <VStack space={4}>
      <Text bold fontSize="md">
        🔍 ตรวจสอบข้อมูล
      </Text>
      <Text bold color={colorTheme.colors.primary}>
        #{jobDetails?.id || "N/A"}
      </Text>
      <Text>วิธีแก้ไข:</Text>
      <Box bg="gray.100" p={2} borderRadius="md">
        <Text>{solution || "ไม่มีรายละเอียดการแก้ไข"}</Text>
      </Box>
      <Text mt={2}>รูปภาพที่แนบ:</Text>
      {images.length > 0 ? (
        <ImagePreview images={images} />
      ) : (
        <Text italic>ไม่มีรูปภาพที่แนบ</Text>
      )}
    </VStack>
  );
};

export default RepairSubmitView;
