import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { tabRoutes } from "../config/tabs";
import { Ionicons } from "@expo/vector-icons";
import AppBarHeader from "../components/AppBarHeader";
import { ScrollView, VStack } from "native-base";
import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack py="4" px="8">
        {children}
      </VStack>
    </ScrollView>
  );
};

const TabNavigator: React.FC = () => {
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
          name={route.name}
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

export default TabNavigator;
