import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import {
  Icon,
  VStack,
  Spacer,
  HStack,
  Avatar,
  Text,
  Button,
  Divider,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { drawerRoutes } from "../config/tabs";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  const { colorTheme } = useTheme();

  const renderDrawerContent = (props: DrawerContentComponentProps) => {
    const handleLogout = () => {
      console.log("User logged out!");
    };

    return (
      <VStack flex={1} bg={colorTheme.colors.primary}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <VStack py={4} space={4}>
            <HStack space={3} alignItems="center">
              <Avatar bgColor={colorTheme.colors.card}></Avatar>
              <VStack>
                <Text color="white" fontSize="md">
                  นายสมชาย สมบัติ
                </Text>
                <Text color="white" fontSize="xs">
                  รหัสพนักงาน : 68000001
                </Text>
                <Text color="white" fontSize="xs">
                  ตำแหน่ง : ช่างซ่อม
                </Text>
              </VStack>
            </HStack>

            <Divider />
          </VStack>
          <DrawerItemList {...props} />
          <Spacer />
          <Button bg={colorTheme.colors.card} rounded="full">
            ออกจากระบบ
          </Button>
        </DrawerContentScrollView>
      </VStack>
    );
  };

  return (
    <Drawer.Navigator
      {...({ id: "DrawerNavigator" } as any)}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colorTheme.colors.primary,
        },
        drawerActiveTintColor: colorTheme.colors.card,
        drawerInactiveTintColor: colorTheme.colors.secondary,
        drawerLabelStyle: {
          fontWeight: "bold",
        },
      }}
      drawerContent={renderDrawerContent}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          title: "หน้าหลัก",
          drawerIcon: ({ focused, color }) => (
            <Icon
              as={Ionicons}
              name={focused ? "home" : "home-outline"}
              size="md"
              color={color}
            />
          ),
        }}
      />

      {drawerRoutes.map((item, index) => (
        <Drawer.Screen
          key={index}
          name={item.title}
          component={item.screen}
          options={{
            title: item.title,
            drawerIcon: ({ focused, color }) => (
              <Icon
                as={Ionicons}
                name={focused ? item.icon : `${item.icon}-outline`}
                size="md"
                color={color}
              />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
