import React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { DrawerParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import RepairScreen from "../screens/RepairScreen";
import RepairHistoryScreen from "../screens/RepairHistoryScreen";
import RepairSubmitScreen from "../screens/RepairSubmitScreen";
import {
  Avatar,
  HStack,
  VStack,
  Text,
  Divider,
  Spacer,
  Button,
  Icon,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import MainBottomTab from "./MainBottomTab";

const Drawer = createDrawerNavigator<DrawerParamsList>();

export const drawerRoutes = [
  {
    title: "แจ้งซ่อม",
    icon: "build",
    screen: RepairScreen,
  },
  {
    title: "ประวัติ",
    icon: "time",
    screen: RepairHistoryScreen,
  },
  {
    title: "ส่งงาน",
    icon: "construct",
    screen: RepairSubmitScreen,
  },
];

const MainDrawer: React.FC = () => {
  const { colorTheme } = useTheme();

  const renderDrawerContent = (props: DrawerContentComponentProps) => {
    const handleLogout = () => {
      console.log("User logged out!");
    };

    return (
      <VStack
        flex={1}
        bg={{
          linearGradient: {
            colors: ["#006B9F", "#00405f"],
            start: [1, 0],
            end: [1, 1],
          },
        }}
        roundedTopRight={20}
        roundedBottomRight={20}
      >
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
          <Button
            bg={colorTheme.colors.card}
            rounded="full"
            _text={{ color: "red.500", fontWeight: "bold" }}
            onPress={handleLogout}
          >
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
        name={"MainBottomTab" as keyof DrawerParamsList}
        component={MainBottomTab}
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
          name={item.title as keyof DrawerParamsList}
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

export default MainDrawer;
