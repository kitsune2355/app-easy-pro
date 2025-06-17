import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation, useTheme } from "@react-navigation/native";
import { VStack, Text, HStack, IconButton, Avatar } from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

type AppBarHeaderNavigationProp = DrawerNavigationProp<any>;

const AppBarHeader: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<AppBarHeaderNavigationProp>();

  return (
    <VStack
      h="48"
      bg={colors.card}
      paddingTop="12"
      paddingBottom='8'
      paddingX="8"
      borderBottomWidth={1}
      borderBottomColor={colors.border}
      borderRadius={30}
    >
      <HStack space={3} alignItems="center" marginBottom="4">
        <IconButton
          icon={
            <Ionicons
              name="menu-outline"
              size={26}
              color={colors.text}
            />
          }
          onPress={() => navigation.openDrawer()}
          _pressed={{
            bg: colors.border,
            opacity: 0.7,
          }}
          borderRadius="full"
          p="2"
        />
        <Text fontSize="xl" fontWeight="bold" color={colors.text}>
          Welcome, to <Text color={colors.primary}>EasyPro</Text>
        </Text>
      </HStack>

      <HStack flex={1} justifyContent="space-between" alignItems="center">
        <HStack space={3} alignItems="center">
          <Avatar
            size="md"
            bg={colors.primary}
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }} // Example image
          >
          </Avatar>
          <VStack>
            <Text fontSize="md" fontWeight="bold" color={colors.text}>
              สมชาย ใจดี
            </Text>
            <Text fontSize="sm" color={colors.text} opacity={0.8}> 
              ตำแหน่ง : ช่างซ่อม
            </Text>
          </VStack>
        </HStack>
        <IconButton
          icon={
            <Ionicons
              name="notifications-outline"
              size={26}
              color={colors.text}
            />
          }
          onPress={() => console.log("Notifications pressed")}
          _pressed={{
            bg: colors.border,
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