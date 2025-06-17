import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { tabRoutes } from "../config/tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import AppBarHeader from "../components/AppBarHeader";
import { ScrollView, VStack } from "native-base";

const Tab = createBottomTabNavigator();

const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack py="4" px="8">
        {children}
      </VStack>
    </ScrollView>
  );
};

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      {...({ id: "TabNavigator" } as any)}
      screenOptions={{
        header: () => <AppBarHeader />,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderRadius: 20,
        },
      }}
    >
      {tabRoutes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={() => <ScreenWrapper>{React.createElement(route.component)}</ScreenWrapper>}
          options={{
            title: route.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={route.icon as keyof typeof Ionicons.glyphMap}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigator;
