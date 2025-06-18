import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { VStack, Text, HStack, IconButton, Avatar } from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";

type AppBarHeaderNavigationProp = DrawerNavigationProp<any>;

const AppBarHeader: React.FC = () => {
  const { colorTheme } = useTheme();
  const navigation = useNavigation<AppBarHeaderNavigationProp>();

  return (
    <VStack
      h="48"
      bg={colorTheme.colors.card}
      paddingBottom='8'
      paddingX="8"
      borderBottomWidth={1}
      borderBottomColor={colorTheme.colors.border}
      rounded='3xl'
      safeAreaTop
    >
      <HStack space={3} alignItems="center" marginBottom="4">
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

      <HStack flex={1} justifyContent="space-between" alignItems="center">
        <HStack space={3} alignItems="center">
          <Avatar
            size="md"
            bg={colorTheme.colors.primary}
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }} // Example image
          >
          </Avatar>
          <VStack>
            <Text fontSize="md" fontWeight="bold" color={colorTheme.colors.text}>
              สมชาย ใจดี
            </Text>
            <Text fontSize="sm" color={colorTheme.colors.text} opacity={0.8}> 
              ตำแหน่ง : ช่างซ่อม
            </Text>
          </VStack>
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
    </VStack>
  );
};

export default AppBarHeader;