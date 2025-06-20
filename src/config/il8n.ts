import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en, th } from '../../assets/locales';

const LANGUAGE_KEY = 'user-language';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    const fallback = 'th';
    callback(savedLanguage || fallback);
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  },
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'th',
    resources: {
      th: { translation: th },
      en: { translation: en },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
