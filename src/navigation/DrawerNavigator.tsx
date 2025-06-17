import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator'; // 👈 Navigator หลักของแอป

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ title: 'หน้าหลัก' }}
      />
      {/* หากต้องการเพิ่มหน้าจอใน Drawer เพิ่มด้านล่างนี้ */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
