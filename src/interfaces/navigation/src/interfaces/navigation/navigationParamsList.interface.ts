import { NavigatorScreenParams } from "@react-navigation/native";

export type StackParamsList = {
  MainBottomTab: NavigatorScreenParams<BottomTabParamsList>;
  MainDrawer: NavigatorScreenParams<DrawerParamsList>;
};
export type DrawerParamsList = {
  RepairScreen: undefined;
  RepairHistoryScreen: undefined;
  RepairSubmitScreen: undefined;
};

export type BottomTabParamsList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
};