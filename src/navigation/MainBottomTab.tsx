import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import { useTheme } from "../context/ThemeContext";
import AppBarHeader from "../components/AppBarHeader";
import ScreenWrapper from "../components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator<BottomTabParamsList>();

export const tabRoutes = [
  {
    name: "HOME",
    component: HomeScreen,
    iconActive: "home",
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
      {...({ id: "TabNavigator" } as any)}
      screenOptions={{
        header: () => <AppBarHeader />,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colorTheme.colors.card,
        tabBarInactiveTintColor: colorTheme.colors.secondary,
        tabBarStyle: {
          backgroundColor: colorTheme.colors.primary,
          borderRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      {tabRoutes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name as keyof BottomTabParamsList}
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
        >
          {() => (
            <ScreenWrapper>
              {React.createElement(route.component)}
            </ScreenWrapper>
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};

export default MainBottomTab;
