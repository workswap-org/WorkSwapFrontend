import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

const supportedLngs = ['en', 'ru', 'fi', 'it'];

const normalizeLanguage = (lng) => lng ? lng.toLowerCase().split('-')[0] : 'en';

const getInitialLanguage = () => {
    try {
        const stored = localStorage.getItem('i18nextLng');
        const norm = normalizeLanguage(stored);
        if (supportedLngs.includes(norm)) return norm;
    } catch {
        //ничего
    }
    const browserLng = normalizeLanguage(navigator.language || navigator.userLanguage);
    return supportedLngs.includes(browserLng) ? browserLng : 'en';
};

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: getInitialLanguage(),
        debug: false,
        interpolation: { escapeValue: false },
        load: 'languageOnly',
        lowerCaseLng: true,
        nonExplicitSupportedLngs: true,
        supportedLngs,
        detection: { caches: ['localStorage'] },
        backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        defaultNS: 'common', // Можно не указывать ns в каждом компоненте, если ключ есть в common
    });

i18n.on('languageChanged', (lng) => {
    const norm = normalizeLanguage(lng);
    if (norm !== lng && supportedLngs.includes(norm))
        i18n.changeLanguage(norm);
});

export default i18n;