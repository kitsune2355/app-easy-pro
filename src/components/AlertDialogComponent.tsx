import React, { useState } from "react";
import {
  AlertDialog,
  Button,
  Text,
  useDisclose,
  Icon,
  HStack,
} from "native-base";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";

type AlertProps = {
  title: string;
  desc?: string;
  status?: "info" | "error" | "success" | "warning";
  buttons?: { text: string; onPress: () => void }[];
};

export const useAlertDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [alertProps, setAlertProps] = useState<AlertProps | null>(null);

  const showAlertDialog = (
    title: string,
    desc?: string,
    status: AlertProps["status"] = "info",
    buttons?: { text: string; onPress: () => void }[]
  ) => {
    setAlertProps({ title, desc, status, buttons });
    onOpen();
  };

  const closeAlertDialog = () => {
    setAlertProps(null);
    onClose();
  };

  const getStatusProps = (status: AlertProps["status"]) => {
    switch (status) {
      case "success":
        return {
          icon: (
            <Icon
              as={Ionicons}
              name="checkmark-circle"
              color="emerald.500"
              size="md"
            />
          ),
          colorScheme: "emerald",
          headerBg: "emerald.100",
          headerColor: "emerald.700",
        };
      case "error":
        return {
          icon: (
            <Icon as={MaterialIcons} name="error" color="red.500" size="md" />
          ),
          colorScheme: "red",
          headerBg: "red.100",
          headerColor: "red.700",
        };
      case "warning":
        return {
          icon: (
            <Icon
              as={Feather}
              name="alert-triangle"
              color="amber.500"
              size="md"
            />
          ),
          colorScheme: "amber",
          headerBg: "amber.100",
          headerColor: "amber.700",
        };
      case "info":
      default:
        return {
          icon: (
            <Icon as={AntDesign} name="infocirlce" color="info.500" size="sm" />
          ),
          colorScheme: "info",
          headerBg: "info.100",
          headerColor: "info.700",
        };
    }
  };

  const currentStatusProps = alertProps
    ? getStatusProps(alertProps.status)
    : getStatusProps("info");

  return {
    showAlertDialog,
    AlertDialogComponent: () => (
      <AlertDialog
        isOpen={isOpen}
        onClose={closeAlertDialog}
        leastDestructiveRef={undefined}
        closeOnOverlayClick={true}
      >
        <AlertDialog.Content
          borderWidth={2}
          borderColor={currentStatusProps.headerBg}
        >
          <AlertDialog.Header
            _text={{
              color: currentStatusProps.headerColor,
              fontWeight: "bold",
            }}
          >
            <HStack alignItems="center" space={2}>
              {currentStatusProps.icon}
              <Text
                fontSize="md"
                fontWeight="bold"
                color={currentStatusProps.headerColor}
              >
                {alertProps?.title}
              </Text>
            </HStack>
          </AlertDialog.Header>

          <AlertDialog.Body px={4} py={3}>
            {alertProps?.desc && (
              <Text fontSize="md" color="coolGray.700">
                {alertProps.desc}
              </Text>
            )}
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <HStack space={2}>
              {alertProps?.buttons?.map((button, index) => (
                <Button
                  key={index}
                  colorScheme={currentStatusProps.colorScheme}
                  _text={{
                    fontWeight: "bold",
                    color: "white",
                  }}
                  size={"sm"}
                  onPress={() => {
                    button.onPress();
                    closeAlertDialog();
                  }}
                  minWidth="80px"
                >
                  {button.text}
                </Button>
              ))}
            </HStack>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    ),
  };
};
