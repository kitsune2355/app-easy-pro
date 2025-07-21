import React, { useCallback, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import { useTheme } from "../context/ThemeContext";
import AppBarHeader from "../components/AppBarHeader";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import NotificationScreen from "../screens/NotificationScreen";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Animated } from "react-native";
import { AppDispatch, RootState } from "../store";
import { fetchNotifications } from "../service/notifyService";

const Tab = createBottomTabNavigator<BottomTabParamsList>();

export const tabRoutes = [
  {
    name: "HOME",
    component: HomeScreen,
    iconActive: "home-sharp",
    iconInactive: "home-outline",
  },
  {
    name: "NOTIFICATION",
    component: NotificationScreen,
    iconActive: "notifications",
    iconInactive: "notifications-outline",
  },
  {
    name: "SETTINGS",
    component: SettingScreen,
    iconActive: "settings",
    iconInactive: "settings-outline",
  },
];

const MainBottomTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const { unreadCount } = useSelector((state: RootState) => state.notify);
   const scrollYRef = useRef<Animated.Value | null>(null);

  const getNotifications = useCallback(async () => {
    dispatch(fetchNotifications({ isRead: null }));
  }, [dispatch]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <AppBarHeader title={route.name} />,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: colorTheme.colors.secondary,
        tabBarStyle: {
          backgroundColor: colorTheme.colors.drawer,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          borderRadius: 20,
        },
      })}
    >
      {tabRoutes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name as keyof BottomTabParamsList}
          component={route.component}
          options={{
            title: t(`SCREENS.${route.name}`),
            tabBarIcon: ({ focused, color, size }) => {
              const iconName = focused ? route.iconActive : route.iconInactive;
              return (
                <View style={{ position: "relative" }}>
                  <Ionicons
                    name={iconName as keyof typeof Ionicons.glyphMap}
                    size={size}
                    color={color}
                  />
                  {route.name === "NOTIFICATION" && unreadCount > 0 && (
                    <View
                      style={{
                        position: "absolute",
                        right: -8,
                        top: -6,
                        backgroundColor: "#ff4444",
                        borderRadius: 10,
                        minWidth: 20,
                        height: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainBottomTab;
