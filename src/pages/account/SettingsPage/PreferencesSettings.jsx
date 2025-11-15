import { useTranslation } from 'react-i18next';
import { LocationSelector } from "@/components";

const PreferencesSettings = ({
    languages,
    toggleLanguage,
    locationId,
    locationChange
}) => {

    const { t } = useTranslation(['tooltips', 'common'])

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
                <LocationSelector locationId={locationId} onChange={locationChange} />
            </div>
        </>
    );
};

export default PreferencesSettings;