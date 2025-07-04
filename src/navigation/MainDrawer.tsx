import React, { useEffect } from "react";
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
  Center,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import MainBottomTab from "./MainBottomTab";
import { useAuth } from "../hooks/useAuth";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchUserById } from "../service/userService";

const Drawer = createDrawerNavigator<DrawerParamsList>();

export const drawerRoutes = [
  {
    title: "REPAIR_REQ",
    icon: "build",
    screen: RepairScreen,
  },
  {
    title: "REPAIR_REQ_HISTORY",
    icon: "time",
    screen: RepairHistoryScreen,
  },
  {
    title: "SUBMIT_REPAIR_REQ",
    icon: "construct",
    screen: RepairSubmitScreen,
  },
];

const MainDrawer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { user, logoutUser } = useAuth();
  const { userDetail } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  }, []);

  const renderDrawerContent = (props: DrawerContentComponentProps) => {
    const handleLogout = async () => {
      try {
        await logoutUser();
        props.navigation.navigate("LoginScreen");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    return (
      <VStack
        flex={1}
        bg={colorTheme.colors.primary}
        roundedTopRight={20}
        roundedBottomRight={20}
      >
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <VStack p={4} space={4}>
            <HStack space={3} alignItems="center">
              <Avatar bgColor={colorTheme.colors.card}></Avatar>
              <VStack>
                <Text color="white" fontSize="md" fontWeight="bold">
                  {userDetail?.user_name} {userDetail?.user_fname}
                </Text>
                <Text color="white" fontSize="xs">
                  ตำแหน่ง : {userDetail?.user_department_name}
                </Text>
              </VStack>
            </HStack>

            <Divider />
          </VStack>
          <DrawerItemList {...props} />
          <Spacer />
          <VStack p={4} space={4} safeAreaBottom>
            <Button
              bg={colorTheme.colors.card}
              rounded="full"
              _text={{ color: "red.500", fontWeight: "bold" }}
              onPress={handleLogout}
            >
              {t("LOGOUT")}
            </Button>
            <Center>
              <Text color="white" fontSize="xs">
                {t("PROACTIVE")}
              </Text>
            </Center>
          </VStack>
        </DrawerContentScrollView>
      </VStack>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colorTheme.colors.primary,
        },
        drawerActiveTintColor: colorTheme.colors.card,
        drawerInactiveTintColor: colorTheme.colors.card,
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
          title: t("SCREENS.HOME"),
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
            title: t(`MENU.${item.title}`),
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
