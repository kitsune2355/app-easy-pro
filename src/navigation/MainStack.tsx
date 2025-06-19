import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import MainDrawer from "./MainDrawer";
import MainBottomTab from "./MainBottomTab";
import { useAuth } from "../hooks/useAuth";
import LoginScreen from "../screens/LoginScreen";

const Stack = createStackNavigator<StackParamsList>();

const MainStack: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator
      {...({ id: "StackNavigator" } as any)}
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? "MainDrawer" : "LoginScreen"}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
    </Stack.Navigator>
  );
};

export default MainStack;
