import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { tabRoutes } from '../config/tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      {tabRoutes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            title: route.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={route.icon as keyof typeof Ionicons.glyphMap} size={size} color={color} />
            ),          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigator;
