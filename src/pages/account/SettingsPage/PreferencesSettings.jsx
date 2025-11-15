import { useTranslation } from 'react-i18next';
import { LocationSelector } from "@/components";
import { useCallback, useEffect, useState } from 'react';

const PreferencesSettings = ({ user, updateUser }) => {
    const { t } = useTranslation(['tooltips', 'common'])

    const [languages, setLanguages] = useState(user.languages || []);

    const locationChange = useCallback((lastId) => {
        updateUser({ location: lastId });
    }, [updateUser]);
    
    const changeLanguages = useCallback(() => {
        updateUser({ languages });
    }, [updateUser, languages]);

    // Языки (переключение кнопок)
    const toggleLanguage = (lang) => {
        setLanguages((prev) =>
            prev.includes(lang)
                ? prev.filter((l) => l !== lang)
                : [...prev, lang]
        );
    };

    useEffect(() => {
        changeLanguages();
    }, [languages, changeLanguages]);

    return (
        <>
            {/* Языки */}
            <div className="form-section">
                <h3>{t(`settings.labels.myLanguages`, { ns: 'common' })}</h3>
                <p>{t(`settings.myLanguages`, { ns: 'tooltips' })}</p>
                <div className="form-group flex-row">
                    {["ru", "fi", "en", "it"].map((lang) => (
                        <button
                            key={lang}
                            type="button"
                            className={`lang-select-btn ${languages.includes(lang) ? "active" : ""}`}
                            onClick={() => toggleLanguage(lang)}
                        >
                            {t(`languages.${lang}`, { ns: 'common' })}
                        </button>
                    ))}
                </div>
            </div>

            {/* Местоположение */}
            <div className="form-section">
                <h3>{t(`settings.labels.myLocation`, { ns: 'common' })}</h3>
                <p>{t(`settings.myLocation`, { ns: 'tooltips' })}</p>
                <LocationSelector locationId={user.locationId} onChange={locationChange} />
            </div>
        </>
    );
};

export default PreferencesSettings;