import React from "react";
import { HStack, IconButton, StatusBar, Text, View } from "native-base";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import Icons from "react-native-vector-icons/MaterialIcons";

interface AppHeaderProps {
  title: string | React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftContent,
  rightContent,
  bgColor,
  textColor,
}) => {
  const { colorTheme } = useTheme();
  const navigation = useNavigation();
  const headerBgColor = bgColor || colorTheme.colors.card;
  const headerTextColor = textColor || colorTheme.colors.text;
  return (
    <>
      <StatusBar hidden={true} />
      <HStack
        bg={headerBgColor}
        py={2}
        px={4}
        borderBottomWidth={1}
        borderBottomColor={colorTheme.colors.border}
        space={3}
        justifyContent="space-between"
        alignItems="center"
        safeAreaTop
      >
        <View>
          {leftContent ?? (
            <IconButton
              icon={
                <Icons
                  name="arrow-back-ios"
                  size={24}
                  color={headerTextColor}
                />
              }
              onPress={() => navigation.goBack()}
              _pressed={{
                bg: colorTheme.colors.border,
                opacity: 0.7,
              }}
              borderRadius="full"
            />
          )}
        </View>
        <View flexGrow={1}>
          <Text color={headerTextColor} fontSize="lg" fontWeight="bold">
            {title}
          </Text>
        </View>
        <View>{rightContent}</View>
      </HStack>
    </>
  );
};

export default AppHeader;
