import React, { useState } from "react";
import { Pressable, FlatList } from "react-native";
import {
  Box,
  Input,
  Actionsheet,
  Text,
  FormControl,
  CheckIcon,
  Icon,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

interface SelectProps {
  isRequired?: boolean;
  label: string;
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  error?: string;
  isDisabled?: boolean;
  renderOption?: (option: { label: string; value: string }) => React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  isRequired,
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
  isDisabled = false,
  renderOption,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error} isDisabled={isDisabled}>
      <FormControl.Label>
        <Text color={colorTheme.colors.text}>{label}</Text>
      </FormControl.Label>

      <Pressable onPress={() => !isDisabled && setIsOpen(true)}>
        <Input
          value={options.find((o) => o.value === value)?.label || ""}
          placeholder={placeholder}
          isReadOnly
          pointerEvents="none"
          borderColor={error ? "#ef4444" : "#d1d5db"}
          InputRightElement={
            <Icon
              as={MaterialIcons}
              name="keyboard-arrow-down"
              size="6"
              mr="2"
              color="gray.400"
            />
          }
        />
      </Pressable>

      <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Actionsheet.Content>
          {options.length === 0 ? (
            <Box p={4}>
              <Text color={colorTheme.colors.text}>{t("ALERT.NO_OPTIONS_AVAILABLE")}</Text>
            </Box>
          ) : (
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Actionsheet.Item
                  style={{ width: "100%",justifyContent: "space-between" }}
                  onPress={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                  _text={{
                    color:
                      value === item.value
                        ? colorTheme.colors.success
                        : colorTheme.colors.text,
                    fontWeight: value === item.value ? "bold" : "normal",
                  }}
                  endIcon={
                    value === item.value ? (
                      <CheckIcon size="4" color={colorTheme.colors.success} right={2} />
                    ) : null
                  }
                >
                  {renderOption ? renderOption(item) : <Text>{item.label}</Text>}
                </Actionsheet.Item>
              )}
              style={{ width: "100%" }}
            />
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </FormControl>
  );
};

export default Select;
