import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

import commonRU from '@/locales/ru/common.json';
import buttonsRU from '@/locales/ru/buttons.json';
import errorsRU from '@/locales/ru/errors.json';
import navigationRU from '@/locales/ru/navigation.json';
import categoriesRU from '@/locales/ru/categories.json';
import messagesRU from '@/locales/ru/messages.json';
import tooltipsRU from '@/locales/ru/tooltips.json';

import commonEN from '@/locales/en/common.json';
import buttonsEN from '@/locales/en/buttons.json';
import errorsEN from '@/locales/en/errors.json';
import navigationEN from '@/locales/en/navigation.json';
import categoriesEN from '@/locales/en/categories.json';
import messagesEN from '@/locales/en/messages.json';
import tooltipsEN from '@/locales/en/tooltips.json';

import commonFI from '@/locales/fi/common.json';
import buttonsFI from '@/locales/fi/buttons.json';
import errorsFI from '@/locales/fi/errors.json';
import navigationFI from '@/locales/fi/navigation.json';
import categoriesFI from '@/locales/fi/categories.json';
import messagesFI from '@/locales/fi/messages.json';
import tooltipsFI from '@/locales/fi/tooltips.json';

import commonIT from '@/locales/it/common.json';
import buttonsIT from '@/locales/it/buttons.json';
import errorsIT from '@/locales/it/errors.json';
import navigationIT from '@/locales/it/navigation.json';
import categoriesIT from '@/locales/it/categories.json';
import messagesIT from '@/locales/it/messages.json';
import tooltipsIT from '@/locales/it/tooltips.json';

const normalizeLanguage = (lng) => {
    if (!lng) return 'en';
    return lng.toLowerCase().split('-')[0];
};

const supported = ['en', 'ru', 'fi', 'it'];

const getInitialLanguage = () => {
    // сначала смотрим localStorage (ручная нормализация)
    try {
        const stored = localStorage.getItem('i18nextLng');
        if (stored && typeof stored === 'string') {
            const norm = normalizeLanguage(stored);
            if (supported.includes(norm)) return norm;
        }
    } catch (e) {
        console.log(e);
        // localStorage может быть недоступен в некоторых окружениях — игнорируем
    }

    // затем браузер
    const nav = navigator.language || navigator.userLanguage || 'en';
    const navNorm = normalizeLanguage(nav);
    if (supported.includes(navNorm)) return navNorm;

    // fallback
    return 'en';
};

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: getInitialLanguage(),      // <- явно нормализованное значение
        fallbackLng: 'en',
        debug: false,
        interpolation: { escapeValue: false },
        load: 'languageOnly',           // уже у тебя — оставь
        lowerCaseLng: true,
        nonExplicitSupportedLngs: true, // добавляет корректную обработку ru-RU -> ru
        supportedLngs: supported,
        detection: { caches: ['localStorage'] }, // если где-то включён LanguageDetector
        
        resources: {
            ru: {
                common: commonRU,
                buttons: buttonsRU,
                errors: errorsRU,
                navigation: navigationRU,
                categories: categoriesRU,
                messages: messagesRU,
                tooltips: tooltipsRU
            },
            en: {
                common: commonEN,
                buttons: buttonsEN,
                errors: errorsEN,
                navigation: navigationEN,
                categories: categoriesEN,
                messages: messagesEN,
                tooltips: tooltipsEN
            },
            fi: {
                common: commonFI,
                buttons: buttonsFI,
                errors: errorsFI,
                navigation: navigationFI,
                categories: categoriesFI,
                messages: messagesFI,
                tooltips: tooltipsFI
            },
            it: {
                common: commonIT,
                buttons: buttonsIT,
                errors: errorsIT,
                navigation: navigationIT,
                categories: categoriesIT,
                messages: messagesIT,
                tooltips: tooltipsIT
            },
        }
    });

i18n.on('languageChanged', (lng) => {
    const norm = normalizeLanguage(lng);
    if (norm !== lng && supported.includes(norm)) {
        // вызов только если нужно, чтобы не зациклиться
        i18n.changeLanguage(norm);
    }
});
export default i18n;