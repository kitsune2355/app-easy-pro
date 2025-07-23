import React, { useCallback, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import { useTheme } from "../context/ThemeContext";
import AppBarHeader from "../components/AppBarHeader";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator<BottomTabParamsList>();

export const tabRoutes = [
  {
    name: "HOME",
    component: HomeScreen,
    iconActive: "home-sharp",
    iconInactive: "home-outline",
  },
  {
    name: "SETTINGS",
    component: SettingScreen,
    iconActive: "settings",
    iconInactive: "settings-outline",
  },
];

const MainBottomTab: React.FC = () => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();

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
                <Ionicons
                  name={iconName as keyof typeof Ionicons.glyphMap}
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainBottomTab;
