import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamsList } from "../interfaces/navigation/src/interfaces/navigation/navigationParamsList.interface";
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import { useTheme } from "../context/ThemeContext";
import AppBarHeader from "../components/AppBarHeader";
import ScreenWrapper from "../components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator<BottomTabParamsList>();

export const tabRoutes = [
  {
    name: 'Home',
    component: HomeScreen,
    label: 'หน้าหลัก',
    iconActive: "home",
    iconInactive: "home-outline",
  },
  {
    name: 'Settings',
    component: SettingScreen,
    label: 'ตั้งค่า',
    iconActive: "settings",
    iconInactive: "settings-outline",
  },
];

const MainBottomTab: React.FC = () => {
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
          component={() => (
            <ScreenWrapper>
              {React.createElement(route.component)}
            </ScreenWrapper>
          )}
          options={{
            title: route.label,
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
