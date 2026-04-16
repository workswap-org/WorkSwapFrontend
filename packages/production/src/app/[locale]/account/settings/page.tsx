"use client"

import { useState, useEffect, useCallback } from "react";
import PrivacySettings from "./PrivacySettings";
import ProfileSettings from "./ProfileSettings";
import PreferencesSettings from "./PreferencesSettings";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { userService } from "@core/lib/services/user";
import SidebarSectionLayout from "@core/components/layout/SidebarSectionLayout/SidebarSectionLayout";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { IFullUser } from "@core/lib/types/models/user";
import accountStyles from "@/app/[locale]/account/AccountLayout.module.scss"

const SettingsSections = Object.freeze({
    PROFILE: { first: true, name: "profile", icon: "user" },
    PRIVACY: { first: false, name: "privacy", icon: "lock" },
    PREFERENCES: { first: false, name: "preferences", icon: "sliders" }
});

const SettingsPage = () => {

    const { notificate } = useNotification();
    const { dict } = useI18n()

    const [user, setUser] = useState<IFullUser | null>(null);

    useEffect(() => {
        async function loadSettings() {
            const data = await userService.getUserSettings();
            setUser(data);
        }

        loadSettings();
    }, [])

    const updateUser = useCallback(async (updates: Partial<IFullUser>) => {
        setUser(prev => prev ? ({ ...prev, ...updates }) : prev);
        userService.modifyUserSettings(updates).catch(() => notificate("Ошибка обновления пользователя", "error"))
    }, [notificate]);

    return (
        <>
            <div className={accountStyles.accountHeader}>
                <h2>{dict.common.titles.settings}</h2>
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