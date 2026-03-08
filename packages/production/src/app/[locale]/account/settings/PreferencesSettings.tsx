import { useMemo } from 'react';
import { IFullUser } from '@core/lib/types/models/user';
import { useI18n } from '@core/lib/contexts/I18nContext';
import LocationSelector from '@/components/ui/selectors/LocationSelector';

interface PreferencesSettingsProps {
    user: IFullUser;
    updateUser: (updates: Partial<IFullUser>) => void;
}
const PreferencesSettings = ({ user, updateUser }: PreferencesSettingsProps) => {

    const { dict } = useI18n();

    const languages = useMemo(() => {
        return user.languages || [];
    }, [user.languages]);

    // Языки (переключение кнопок)
    const toggleLanguage = (lang: string) => {
        updateUser({ languages: languages.includes(lang) ? languages.filter((l) => l !== lang) : [...languages, lang] })
    };

    return (
        <>
            {/* Языки */}
            <div className="form-section">
                <h3>{dict.common.settings.labels.myLanguages}</h3>
                <p>{dict.tooltips.settings.myLanguages}</p>
                <div className="form-group flex-row">
                    {["ru", "fi", "en", "it"].map((lang) => (
                        <button
                            key={lang}
                            type="button"
                            className={`lang-select-btn ${languages.includes(lang) ? "active" : ""}`}
                            onClick={() => toggleLanguage(lang)}
                        >
                            {dict.common.languages[lang]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Местоположение */}
            <div className="form-section">
                <h3>{dict.common.settings.labels.myLocation}</h3>
                <p>{dict.tooltips.settings.myLocation}</p>
                <LocationSelector locationId={user.locationId} onChange={(locationId) => updateUser({ locationId: locationId })} />
            </div>
        </>
    );
};

export default PreferencesSettings;