import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";

export const tabRoutes = [
  {
    name: 'Home',
    component: HomeScreen,
    label: 'หน้าหลัก',
    icon: 'home-outline',
  },
  {
    name: 'Settings',
    component: SettingScreen,
    label: 'ตั้งค่า',
    icon: 'settings-outline',
  },
];
