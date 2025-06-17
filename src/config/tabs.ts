import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";


export const tabRoutes = [
  {
    name: 'Home',
    component: HomeScreen,
    label: 'หน้าหลัก',
  },
  {
    name: 'Settings',
    component: SettingScreen,
    label: 'ตั้งค่า',
  },
];
