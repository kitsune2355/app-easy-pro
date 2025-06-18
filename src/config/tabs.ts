import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import RepairScreen from "../screens/RepairScreen";
import RepairHistoryScreen from "../screens/RepairHistoryScreen";
import RepairSubmitScreen from "../screens/RepairSubmitScreen";

export const tabRoutes = [
  {
    name: 'Home',
    component: HomeScreen,
    label: 'หน้าหลัก',
    iconActive: "home",
    iconInactive: "home-outline",
  },
  {
    name: 'Settings',
    component: SettingScreen,
    label: 'ตั้งค่า',
    iconActive: "settings",
    iconInactive: "settings-outline",
  },
];

export const drawerRoutes = [
  {
      title: "แจ้งซ่อม",
      icon: "build",
      screen: RepairScreen,
    },
    {
      title: "ประวัติ",
      icon: "time",
      screen: RepairHistoryScreen,
    },
    {
      title: "ส่งงาน",
      icon: "construct",
      screen: RepairSubmitScreen,
    },
];