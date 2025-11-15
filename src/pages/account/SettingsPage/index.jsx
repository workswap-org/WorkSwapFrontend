import { useState, useEffect, useCallback } from "react";
import { 
    modifyUserSettings,
    getUserSettings,
    useNotification
} from "@core/lib";
import { useTranslation } from 'react-i18next';
import PrivacySettings from "./PrivacySettings";
import ProfileSettings from "./ProfileSettings";
import PreferencesSettings from "./PreferencesSettings";
import { SidebarSectionLayout } from '@/components';

const SettingsSections = Object.freeze({
    PROFILE: { first: true, name: "profile", icon: "user" },
    PRIVACY: { first: false, name: "privacy", icon: "lock" },
    PREFERENCES: { first: false, name: "preferences", icon: "sliders" }
});

const SettingsPage = () => {

    const {notificate} = useNotification();
    const { t } = useTranslation(['tooltips', 'common'])

    const [user, setUser] = useState([]);

    useEffect(() => {
        async function loadSettings() {
            const data = await getUserSettings();
            setUser(data.user);
        }

        loadSettings();
    }, [])

    const updateUser = useCallback(async (updates) => {
        try {
            const res = await modifyUserSettings(updates);

            if (res.message) {
                // ничего
            } else {
                notificate("Ошибка обновления пользователя", "error");
            }
        } catch (err) {
            notificate("Ошибка обновления пользователя", "error");
            throw err;
        }
    }, [notificate]);

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.settings`, { ns: 'common' })}</h2>
            </div>
            {user && (
                <SidebarSectionLayout
                    pageName={'settings'}
                    sections={SettingsSections}
                >
                    {(currentSection) => (
                        currentSection === SettingsSections.PROFILE ? (
                            <ProfileSettings
                                user={user}
                                updateUser={updateUser}
                            />
                        ) :
                        currentSection === SettingsSections.PRIVACY ? (
                            <PrivacySettings
                                user={user}
                                updateUser={updateUser}
                            />
                        ) :
                        currentSection === SettingsSections.PREFERENCES ? (
                            <PreferencesSettings
                                user={user}
                                updateUser={updateUser}
                            />
                        ) :
                        null
                    )}
                </SidebarSectionLayout>
            )}
        </>
    );
}

export default SettingsPage;