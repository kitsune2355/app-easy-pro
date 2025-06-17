import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      {...({ id: "DrawerNavigator" } as any)}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ title: "หน้าหลัก" }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
