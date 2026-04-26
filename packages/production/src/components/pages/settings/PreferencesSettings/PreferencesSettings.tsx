import { useMemo } from 'react';
import { IFullUser } from '@core/lib/types/models/user';
import { useI18n } from '@core/lib/contexts/I18nContext';
import LocationSelector from '@/components/ui/selectors/LocationSelector';
import SettingSection from '../SettingSection/SettingSection';
import styles from "./PreferencesSettings.module.scss"

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
            <SettingSection
                title={dict.common.settings.labels.myLanguages}
                subtitle={dict.tooltips.settings.myLanguages}
            >
                <div className="form-group flex-row">
                    {["ru", "fi", "en", "it"].map((lang) => (
                        <button
                            key={lang}
                            type="button"
                            className={`${styles.langSelectBtn} ${languages.includes(lang) ? "active" : ""}`}
                            onClick={() => toggleLanguage(lang)}
                        >
                            {dict.common.languages[lang]}
                        </button>
                    ))}
                </div>
            </SettingSection>

            {/* Местоположение */}
            <SettingSection
                title={dict.common.settings.labels.myLocation}
                subtitle={dict.tooltips.settings.myLocation}
            >
                <LocationSelector locationId={user.locationId} onChange={(locationId) => updateUser({ locationId: locationId })} />
            </SettingSection>
        </>
    );
};

export default PreferencesSettings;