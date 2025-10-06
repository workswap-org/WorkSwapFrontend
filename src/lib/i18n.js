import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

import commonRU from '@core/locales/ru/common.json';
import buttonsRU from '@core/locales/ru/buttons.json';
import errorsRU from '@core/locales/ru/errors.json';
import navigationRU from '@core/locales/ru/navigation.json';
import categoriesRU from '@core/locales/ru/categories.json';
import messagesRU from '@core/locales/ru/messages.json';
import tooltipsRU from '@core/locales/ru/tooltips.json';

import commonEN from '@core/locales/en/common.json';
import buttonsEN from '@core/locales/en/buttons.json';
import errorsEN from '@core/locales/en/errors.json';
import navigationEN from '@core/locales/en/navigation.json';
import categoriesEN from '@core/locales/en/categories.json';
import messagesEN from '@core/locales/en/messages.json';
import tooltipsEN from '@core/locales/en/tooltips.json';

import commonFI from '@core/locales/fi/common.json';
import buttonsFI from '@core/locales/fi/buttons.json';
import errorsFI from '@core/locales/fi/errors.json';
import navigationFI from '@core/locales/fi/navigation.json';
import categoriesFI from '@core/locales/fi/categories.json';
import messagesFI from '@core/locales/fi/messages.json';
import tooltipsFI from '@core/locales/fi/tooltips.json';

import commonIT from '@core/locales/it/common.json';
import buttonsIT from '@core/locales/it/buttons.json';
import errorsIT from '@core/locales/it/errors.json';
import navigationIT from '@core/locales/it/navigation.json';
import categoriesIT from '@core/locales/it/categories.json';
import messagesIT from '@core/locales/it/messages.json';
import tooltipsIT from '@core/locales/it/tooltips.json';

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