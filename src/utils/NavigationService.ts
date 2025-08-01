import { createNavigationContainerRef } from "@react-navigation/native";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";

export const navigationRef = createNavigationContainerRef<StackParamsList>();

export function navigate(name: keyof StackParamsList, params?: any) {
  if (navigationRef.isReady()) {
    (navigationRef as any).navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function reset(state: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset(state);
  }
}
