import React from "react";
import { Pressable } from "react-native";
import { Input, Icon, VStack } from "native-base";
import { Ionicons } from "react-native-vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  containerStyle?: any;
};

const SearchBar = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  containerStyle,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

  return (
    <VStack {...containerStyle}>
      <Input
        placeholder={t("SEARCH_PLACEHOLDER")}
        value={searchQuery}
        onChangeText={onSearchChange}
        bg={colorTheme.colors.card}
        borderColor={colorTheme.colors.border}
        color={colorTheme.colors.text}
        placeholderTextColor={colorTheme.colors.text + "80"}
        rounded="md"
        shadow={1}
        fontSize="sm"
        InputLeftElement={
          <Icon
            as={Ionicons}
            name="search"
            size="sm"
            ml={3}
            color={colorTheme.colors.text}
          />
        }
        InputRightElement={
          searchQuery ? (
            <Pressable onPress={onClearSearch}>
              <Icon
                as={Ionicons}
                name="close-circle"
                size="sm"
                mr={3}
                color={colorTheme.colors.text}
              />
            </Pressable>
          ) : undefined
        }
      />
    </VStack>
  );
};

export default SearchBar;
