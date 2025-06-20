import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ToastAndroid, Platform } from 'react-native';

export const useDoubleBackExit = () => {
  const {t} = useTranslation();
  const backPressed = useRef<number>(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (Platform.OS !== 'android' || !isFocused) return;

    const onBackPress = () => {
      const now = Date.now();

      if (backPressed.current && now - backPressed.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      backPressed.current = now;
      ToastAndroid.show(`${t('TAP_TO_EXIT')}`, ToastAndroid.SHORT);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  }, [isFocused]);
};