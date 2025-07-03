import React from "react";
import { Box, Text, useToast } from "native-base";

type toastStatus = "success" | "error" | "warning" | "info";
type toastPlacement = "top" | "bottom" | "top-right" | "top-left" | "bottom-left" | "bottom-right";

interface ToastMessageProps {
  status: toastStatus;
  message: string;
}

const getStatusColor = (status: toastStatus): string => {
  switch (status) {
    case "success":
      return "emerald.500";
    case "error":
      return "red.500";
    case "warning":
      return "amber.500";
    case "info":
      return "blue.500";
    default:
      return "gray.500";
  }
};

const ToastMessage: React.FC<ToastMessageProps> = ({ status, message }) => {
  return (
    <Box
      bg={getStatusColor(status)}
      px="2"
      py="1"
      rounded="full"
      mb={5}
    >
      <Text color="white">{message}</Text>
    </Box>
  );
};

export const useToastMessage = () => {
  const toast = useToast();

  const showToast = (
    status: toastStatus,
    message: string,
    placement: toastPlacement = 'bottom'
  ) => {
    toast.show({
      render: () => <ToastMessage status={status} message={message} />,
      duration: 3000,
      placement: placement,
    });
  };

  return { showToast };
};

export default ToastMessage;
