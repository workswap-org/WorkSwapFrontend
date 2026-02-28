import { useTranslation } from 'react-i18next';
import { LocationSelector } from "@/components";
import { useCallback, useMemo } from 'react';

const PreferencesSettings = ({ user, updateUser }) => {
    const { t } = useTranslation(['tooltips', 'common'])

    const languages = useMemo(() => {
        return user.languages || [];
    }, [user.languages]);

    const locationChange = useCallback((lastId) => {
        updateUser({ locationId: lastId });
    }, [updateUser]);

    // Языки (переключение кнопок)
    const toggleLanguage = (lang) => {
        updateUser({ languages: languages.includes(lang) ? languages.filter((l) => l !== lang) : [...languages, lang] })
    };

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