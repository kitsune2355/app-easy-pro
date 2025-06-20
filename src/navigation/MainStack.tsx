import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import MainDrawer from "./MainDrawer";
import MainBottomTab from "./MainBottomTab";
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import RepairScreen from "../screens/RepairScreen";
import RepairHistoryScreen from "../screens/RepairHistoryScreen";
import RepairSubmitScreen from "../screens/RepairSubmitScreen";

const Stack = createStackNavigator<StackParamsList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      {...({ id: "StackNavigator" } as any)}
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen name="RepairScreen" component={RepairScreen} />
      <Stack.Screen name="RepairHistoryScreen" component={RepairHistoryScreen} />
      <Stack.Screen name="RepairSubmitScreen" component={RepairSubmitScreen} />
      <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
    </Stack.Navigator>
  );
};

export default MainStack;
