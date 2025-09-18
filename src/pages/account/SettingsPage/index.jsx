import "@/css/pages/settings-page.css"
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/lib/contexts/notifications/NotificationContext";
import { useTranslation } from 'react-i18next';
import PrivacySettings from "./PrivacySettings";
import ProfileSettings from "./ProfileSettings";
import PreferencesSettings from "./PreferencesSettings";

const SettingsPage = () => {

    const notificate = useNotification();
    const { t } = useTranslation(['tooltips', 'common'])

    const [user, setUser] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [phoneVisible, setPhoneVisible] = useState(false);
    const [emailVisible, setEmailVisible] = useState(false);
    const [avatarType, setAvatarType] = useState("uploaded");
    const [languages, setLanguages] = useState([]);
    const [locationId, setLocationId] = useState(null);

    const [dataLoaded, setDataLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [mobileSectionsVisible, setMobileSectionsVisible] = useState(true);

    const [settingsSection, setSettingsSection] = useState("profile")

    // Подсчёт символов
    const maxNameLen = 30;
    const maxPhoneLen = 16;
    const maxBioLen = 1900;

    useEffect(() => {
        async function loadSettings() {
            const data = await apiFetch(`/api/user/current/settings`)
            setUser(data.user);
        }

        loadSettings();
    }, [])

    useEffect(() => {

        if (!user.name) return;
        
        setDataLoaded(true);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
        setBio(user.bio);
        setPhoneVisible(user.phoneVisible);
        setEmailVisible(user.emailVisible);
        setLocationId(user.locationId);
        setAvatarType(user.avatarType);
        setLanguages(user.languages);

    }, [user]);

    function changeSettingsSection(section) {
        setSettingsSection(section)
        setMobileSectionsVisible(false)
    }

    function toggleMobileSections() {
        setMobileSectionsVisible(!mobileSectionsVisible);
    }

    const updateUser = useCallback(async (updates) => {
        try {
            const res = await apiFetch(`/api/user/modify`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (res.message) {
                setSaving(false);
            } else {
                notificate("Ошибка обновления пользователя", "error");
            }
        } catch (err) {
            notificate("Ошибка обновления пользователя", "error");
            throw err;
        }
    }, [notificate]);

    const nameChange = useCallback((name) => {
        setName(name);
        setSaving(true);
        updateUser({ name });
    }, [updateUser]);

    const locationChange = useCallback((lastId, path) => {
        console.log("[L] Путь:", path);
        setSaving(true);
        updateUser({ location: lastId });
    }, [updateUser]);

    const phoneChange = useCallback((phone) => {
        setPhone(validatePhone(phone));
        setSaving(true);
        updateUser({ phone });
    }, [updateUser]);

    const phoneVisibleChange = useCallback((phoneVisible) => {
        setPhoneVisible(phoneVisible);
        setSaving(true);
        updateUser({ phoneVisible });
    }, [updateUser]);

    const emailVisibleChange = useCallback((emailVisible) => {
        setEmailVisible(emailVisible);
        setSaving(true);
        updateUser({ emailVisible });
    }, [updateUser]);

    const bioChange = useCallback((bio) => {
        setBio(bio);
        setSaving(true);
        updateUser({ bio });
    }, [updateUser]);

    // Валидация телефона
    function validatePhone(value) {
        let val = value;
        if (val.indexOf("+") > 0) val = val.replace(/\+/g, "");
        val = val.replace(/[^0-9+]/g, "");
        if (val.indexOf("+") > 0) val = val.replace(/\D/g, "");
        if ((val.match(/\+/g) || []).length > 1) {
            const parts = val.split("+");
            val = "+" + parts.slice(1).join("");
        }
        return val;
    }

    const changeLanguages = useCallback(() => {
        setSaving(true);
        updateUser({ languages });
    }, [updateUser, languages]);

    const avatarTypeChange = useCallback((avatarType, avatarUrl) => {
        setSaving(true);

        setAvatarType(avatarType);
        updateUser({ avatarType });
        updateUser({ avatarUrl });
    }, [updateUser]);

    // Языки (переключение кнопок)
    const toggleLanguage = (lang) => {
        setLanguages((prev) =>
            prev.includes(lang)
                ? prev.filter((l) => l !== lang)
                : [...prev, lang]
        );
    };

    useEffect(() => {
        if (dataLoaded) { // условие по желанию
            changeLanguages();
        }
    }, [languages, changeLanguages, dataLoaded]);

    return (
        <>
            <div className="account-header">
                <h2>{t(`titles.settings`, { ns: 'common' })}</h2>
                {saving && (
                    <i className="fa-regular fa-download fa-spin fa-spin-reverse fa-2xl"></i>
                )}
            </div>
            <div className="settings-page">
                <div className={`settings-sections ${mobileSectionsVisible ? "show" : ""}`}>
                    <button className="btn settings-section-btn hover" onClick={() => changeSettingsSection("profile")}>Профиль</button>
                    <button className="btn settings-section-btn hover" onClick={() => changeSettingsSection("privacy")}>Конфиденциальность</button>
                    <button className="btn settings-section-btn hover" onClick={() => changeSettingsSection("preferences")}>Предпочтения</button>
                </div>
                <div className="settings-container">

                    <button className="settings-sections-togger" onClick={() => toggleMobileSections()}>
                        <i className="fa-regular fa-list fa-2xl"></i>
                        <i className="fa-regular fa-left-to-dotted-line fa-2xl"></i>
                    </button>

                    {(settingsSection == "privacy") && (
                        <PrivacySettings
                            phoneVisible={phoneVisible}
                            phoneVisibleChange={phoneVisibleChange}
                            emailVisible={emailVisible}
                            emailVisibleChange={emailVisibleChange}
                        />
                    )}

                    {(settingsSection == "profile") && (
                        <ProfileSettings
                            user={user}
                            name={name}
                            email={email}
                            phone={phone}
                            avatarType={avatarType}
                            bio={bio}

                            nameChange={nameChange}
                            phoneChange={phoneChange}
                            avatarTypeChange={avatarTypeChange}
                            bioChange={bioChange}

                            maxNameLen={maxNameLen}
                            maxPhoneLen={maxPhoneLen}
                            maxBioLen={maxBioLen}
                        />
                    )}

                    {(settingsSection == "preferences") && (
                        <PreferencesSettings
                            languages={languages}
                            toggleLanguage={toggleLanguage}
                            locationId={locationId}
                            locationChange={locationChange}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default SettingsPage;