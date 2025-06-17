import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { tabRoutes } from '../config/tabs';

const Tab = createBottomTabNavigator();

const TabNavigator:React.FC = () => {
  return (
    <Tab.Navigator>
      {tabRoutes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{ title: route.label }}
        />
      ))}
    </Tab.Navigator>
  )
}

export default TabNavigator