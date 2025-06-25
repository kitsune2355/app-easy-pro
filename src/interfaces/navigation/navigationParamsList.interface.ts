import { NavigatorScreenParams } from "@react-navigation/native";

export type StackParamsList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  MainBottomTab: undefined;
  MainDrawer: undefined;
  RepairScreen: undefined;
  RepairHistoryScreen: {statusKey: string};
  RepairSubmitScreen: undefined;
  RepairDetailScreen: {repairId: string};
};
export type DrawerParamsList = {
  MainStack: NavigatorScreenParams<StackParamsList>;
};

export type BottomTabParamsList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
};