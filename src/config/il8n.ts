import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import { en, th } from '../../assets/locales';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'th',
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