export const Languages = Object.freeze({
    FI: { code: "fi", label: "Suomi" },
    EN: { code: "en", label: "English" },
    RU: { code: "ru", label: "Русский" },
    // IT: { code: "it", label: "Italiano" }
});

// Также можно создать массив для перебора
export const languagesList = Object.values(Languages);
export const supportedLanguages = Object.values(Languages).map(lang => lang.code);