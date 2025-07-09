import React, { useState } from "react";
import { Pressable, FlatList } from "react-native";
import {
  Box,
  Input,
  Actionsheet,
  Text,
  FormControl,
  CheckIcon,
  Icon
} from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from "../context/ThemeContext";

const Select = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
  isDisabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  error?: string;
  isDisabled?: boolean;
}) => {
    const {colorTheme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      <FormControl.Label>{label}</FormControl.Label>

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
            <Box p={4}><Text>No options available.</Text></Box>
          ) : (
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Actionsheet.Item
                  onPress={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                  _text={{
                    color: value === item.value ? colorTheme.colors.primary : 'black',
                    fontWeight: value === item.value ? 'bold' : 'normal',
                  }}
                  startIcon={
                    value === item.value ? (
                      <CheckIcon size="4" color={colorTheme.colors.primary} />
                    ) : null
                  }
                >
                  {item.label}
                </Actionsheet.Item>
              )}
              style={{ width: '100%' }}
            />
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </FormControl>
  );
};

export default Select;