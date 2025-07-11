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
import RepairDetailScreen from "../screens/RepairDetailScreen";
import NotificationScreen from "../screens/NotificationScreen";

const Stack = createStackNavigator<StackParamsList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      id="MainStack"
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="RepairScreen" component={RepairScreen} />
      <Stack.Screen
        name="RepairHistoryScreen"
        component={RepairHistoryScreen}
      />
      <Stack.Screen name="RepairSubmitScreen" component={RepairSubmitScreen} />
      <Stack.Screen name="RepairDetailScreen" component={RepairDetailScreen} />
      <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
    </Stack.Navigator>
  );
};

export default MainStack;
