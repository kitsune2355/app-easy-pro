import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";

export type StackParamsList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  MainBottomTab: undefined;
  MainDrawer: undefined;
  NotificationScreen: undefined;
  RepairScreen: undefined;
  RepairHistoryScreen: {statusKey: string};
  RepairSubmitScreen: {repairId?: string};
  RepairDetailScreen: {repairId: string};
};
export type DrawerParamsList = {
  MainStack: NavigatorScreenParams<StackParamsList>;
};

export type BottomTabParamsList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
};
// -------------------------------------------------------------------------------------------------------------

export type RepairHistoryScreenRouteProp = RouteProp<
  { RepairHistoryScreen: { statusKey?: string } },
  "RepairHistoryScreen"
>;

export type RepairSubmitScreenRouteProp = RouteProp<
  { RepairSubmitScreen: { repairId?: string } },
  "RepairSubmitScreen"
>;