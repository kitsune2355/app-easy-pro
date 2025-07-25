import React, { useCallback } from "react";
import { HStack, Pressable, Text } from "native-base";
import { useTheme } from "../context/ThemeContext";

interface ILanguageButtonGroupComponentProps {
  langs: string[];
  value: string;
  color?: string;
  textColor?: string;
  borderColor?: string;
  onPress?(lang: string): void;
}

export const LanguageButtonGroup: React.FC<
  ILanguageButtonGroupComponentProps
> = ({ langs, value, color, textColor, borderColor, onPress }) => {
  const { colorTheme } = useTheme();
  const handlePress = useCallback(
    (lang: string) => {
      if (onPress) {
        onPress(lang);
      }
    },
    [onPress]
  );
  return (
    <HStack
      width={langs.length * 44}
      borderWidth={1}
      borderRadius={4}
      overflow="hidden"
      borderColor={borderColor || colorTheme.colors.border}
      alignItems="center"
    >
      {langs.map((lang, key) => (
        <Pressable
          key={key}
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor={value === lang ? color : "transparent"}
          onPress={() => handlePress(lang)}
        >
          <Text
            textTransform="uppercase"
            fontWeight="500"
            color={textColor || colorTheme.colors.border}
          >
            {lang}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
};
