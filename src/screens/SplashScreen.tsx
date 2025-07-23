import React, { useEffect } from "react";
import { Box, Center, Text, Spinner, VStack, Image } from "native-base";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import { useTranslation } from "react-i18next";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { fetchNotifications } from "../service/notifyService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchAllRepairs } from "../service/repairService";

type SplashScreenNavigationProp = StackNavigationProp<
  StackParamsList,
  "SplashScreen"
>;

const SplashScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { checkLoginStatus } = useAuth();
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
  const init = async () => {
    const loggedIn = await checkLoginStatus();
    if (loggedIn) {
      try {
        await registerForPushNotificationsAsync();
        await dispatch(fetchAllRepairs());
        await dispatch(fetchNotifications({ isRead: null }))
      } catch (err) {
        console.log("❌ เกิดข้อผิดพลาดขณะ register push notification:", err);
      }
    }
    setTimeout(() => {
      navigation.replace(loggedIn ? "MainDrawer" : "LoginScreen");
    }, 3000);
  };

  init();
}, []);

  return (
    <Box safeAreaBottom flex={1} bg={{
      linearGradient: {
        colors: ["#006B9F", "#00405f"],
        start: [0, 0],
        end: [1, 1],
      },
    }}>
      <Center flex={1}>
        <VStack space={8} alignItems="center">
          <Box bg="white" rounded="full" p={4} shadow={5}>
            <Image
              source={require("../../assets/images/logo.png")}
              alt="Logo"
              size={20}
            />
          </Box>
          <VStack space={2} alignItems="center">
            <Text fontSize="3xl" fontWeight="bold" color="white">
              EasyPro
            </Text>
            <Text fontSize="md" color="white" opacity={0.8}>
              {t("MAINTENANCE_SYSTEM")}
            </Text>
          </VStack>
          <VStack space={3} alignItems="center">
            <Spinner size="lg" color="white" />
            <Text fontSize="sm" color="white" opacity={0.7}>
              {t("LOADING")}
            </Text>
          </VStack>
        </VStack>
        <Box position="absolute" bottom={3}>
          <Text fontSize="xs" color="white" opacity={0.6} textAlign="center">
            {t('VERSION')} 1.0.0
          </Text>
        </Box>
      </Center>
    </Box>
  );
};

export default SplashScreen;
