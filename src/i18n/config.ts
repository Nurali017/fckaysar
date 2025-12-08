import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import kk from './locales/kk';
import ru from './locales/ru';
import en from './locales/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      kk,
      ru,
      en
    },
    lng: 'kk', // Default language
    fallbackLng: 'kk',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
