import React from "react";
import { Box, Text, useToast } from "native-base";

interface ToastMessageProps {
  status: "success" | "error" | "warning" | "info";
  message: string;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ status, message }) => {
  return (
    <Box
      bg={status === "success" ? "emerald.500" : "red.500"}
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

  const showToast = (status: "success" | "error" | "warning" | "info", message: string) => {
    toast.show({
      render: () => <ToastMessage status={status} message={message} />,
      duration: 3000,
      placement: "top"
    });
  };

  return { showToast };
};

export default ToastMessage;
