import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Text, HStack, IconButton } from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { DrawerParamsList } from "../interfaces/navigation/navigationParamsList.interface";

const AppBarHeader: React.FC = () => {
  const { colorTheme } = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamsList>>();

  return (
    <HStack
      bg={colorTheme.colors.card}
      py={2}
      px={8}
      borderBottomWidth={1}
      borderBottomColor={colorTheme.colors.border}
      rounded="3xl"
      space={3}
      justifyContent="space-between"
      alignItems="center"
      safeAreaTop
    >
      <HStack space={3} alignItems="center">
        <IconButton
          icon={
            <Ionicons
              name="menu-outline"
              size={26}
              color={colorTheme.colors.text}
            />
          }
          onPress={() => navigation.openDrawer()}
          _pressed={{
            bg: colorTheme.colors.border,
            opacity: 0.7,
          }}
          borderRadius="full"
          p="2"
        />
        <Text fontSize="xl" fontWeight="bold" color={colorTheme.colors.text}>
          Welcome, to <Text color={colorTheme.colors.primary}>EasyPro</Text>
        </Text>
      </HStack>

      <IconButton
        icon={
          <Ionicons
            name="notifications-outline"
            size={26}
            color={colorTheme.colors.text}
          />
        }
        onPress={() => console.log("Notifications pressed")}
        _pressed={{
          bg: colorTheme.colors.border,
          opacity: 0.7,
        }}
        borderRadius="full"
        p="2"
      />
    </HStack>
  );
};

export default AppBarHeader;
