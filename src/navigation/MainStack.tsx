import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/src/interfaces/navigation/navigationParamsList.interface";
import MainDrawer from "./MainDrawer";
import MainBottomTab from "./MainBottomTab";

const Stack = createStackNavigator<StackParamsList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
    {...({ id: "StackNavigator" } as any)}
      screenOptions={{ headerShown: false }}
      initialRouteName="MainDrawer"
    >
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
    </Stack.Navigator>
  );
};

export default MainStack;
