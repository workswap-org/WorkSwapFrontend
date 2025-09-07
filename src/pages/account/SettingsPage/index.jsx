import "#/css/public/pages/settings-page.css"
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/apiClient";
import { useNotification } from "@/contexts/notifications/NotificationContext";
import LocationSelector from "@/components/selectors/LocationSelector";

const SettingsPage = () => {

    const notificate = useNotification();

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

    // Подсчёт символов
    const maxNameLen = 30;
    const maxPhoneLen = 16;
    const maxBioLen = 1900;

    useEffect(() => {
        async function loadSettings() {
            const data = await apiFetch(`/api/user/current/settings`)
            console.log(data);
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
        console.log("[N] Имя:", name);
        setName(name);

        setSaving(true);
        updateUser({ name });
    }, [updateUser]);

    const locationChange = useCallback((lastId, path) => {
        console.log("[L] Последний выбранный:", lastId);
        console.log("[L] Путь:", path);
        setSaving(true);
        updateUser({ location: lastId });
    }, [updateUser]);

    const phoneChange = useCallback((phone) => {
        console.log("[P] Телефон:", phone);
        setPhone(validatePhone(phone));

        setSaving(true);
        updateUser({ phone });
    }, [updateUser]);

    const phoneVisibleChange = useCallback((phoneVisible) => {
        console.log("[P] :", phoneVisible);
        setPhoneVisible(phoneVisible);

        setSaving(true);
        updateUser({ phoneVisible });
    }, [updateUser]);

    const emailVisibleChange = useCallback((emailVisible) => {
        console.log("[E] Почта:", emailVisible);
        setEmailVisible(emailVisible);

        setSaving(true);
        updateUser({ emailVisible });
    }, [updateUser]);

    const changeBio = useCallback((bio) => {
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
        console.log("[L] Языки:", languages);

        setSaving(true);
        updateUser({ languages });
    }, [updateUser, languages]);

    const changeAvatarType = useCallback((avatarType, avatarUrl) => {
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
                <h2>Настройки пользователя</h2>
                {saving && (
                    <i className="fa-regular fa-download fa-spin fa-spin-reverse fa-2xl"></i>
                )}
            </div>
            <form>
                {/* Имя, Email, Телефон */}
                <div className="form-section">
                    <h3>Основная информация</h3>
                    <div>
                        <div className="form-group">
                            <label>Имя</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={name ?? ""}
                                    onChange={(e) => nameChange(e.target.value)}
                                    maxLength={maxNameLen}
                                    required
                                />
                                <span className="char-counter">{name.length} / {maxNameLen}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                /* onChange={(e) => emailChange(e.target.value)} */
                                /* required */
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Телефон</label>
                            <div className="input-wrapper">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => phoneChange(e.target.value)}
                                    maxLength={maxPhoneLen}
                                />
                                <span className="char-counter">{phone.length} / {maxPhoneLen}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 th:text="#{profile.editing.privacy}">Конфиденциальность</h3>
                    <div className="form-group">
                        <label th:text="#{profile.editing.contacts.visible}">Отображение ваших контактных данных для других пользователей</label>
                        <div className="status-toggle">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={phoneVisible}
                                    onChange={(e) => phoneVisibleChange(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span th:text="${user.phoneVisible} ? #{profile.editing.phone} : #{profile.editing.phone}">Отображение номера телефона</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="status-toggle">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={emailVisible}
                                    onChange={(e) => emailVisibleChange(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span th:text="${user.emailVisible} ? #{profile.editing.email} : #{profile.editing.email}">Отображение email</span>
                        </div>
                    </div>
                </div>

                {/* Аватар */}
                <div className="form-section">
                    <h3>Аватар</h3>
                    <div className="avatar-options">
                        <div
                            className={`avatar-option ${avatarType === "uploaded" ? "selected" : ""}`}
                            onClick={() => changeAvatarType("uploaded", user.uploadedAvatar)}
                        >
                            <img className="avatar-preview avatar p80-avatar" src={user.uploadedAvatar || "/images/upload-foto.png"} alt="Моя" />
                            <span>Моя</span>
                        </div>
                        <div
                            className={`avatar-option ${avatarType === "google" ? "selected" : ""}`}
                            onClick={() => changeAvatarType("google", user.googleAvatar)}
                        >
                            <img className="avatar-preview avatar p80-avatar" src={user.googleAvatar} alt="Google" />
                            <span>Google</span>
                        </div>
                        <div
                            className={`avatar-option ${avatarType === "default" ? "selected" : ""}`}
                            onClick={() => changeAvatarType("default", "/images/avatar-placeholder.png")}
                        >
                            <img className="avatar-preview avatar p80-avatar" src="/images/avatar-placeholder.png" alt="Default" />
                            <span>Стандарт</span>
                        </div>
                    </div>

                    {avatarType === "uploaded" && (
                        <div className="upload-controls">
                            {/* Твой uploadControls компонент */}
                            <input type="file" name="avatarFile" />
                        </div>
                    )}
                </div>

                {/* Языки */}
                <div className="form-section">
                    <h3>Языки которыми я владею</h3>
                    <p>Укажите несколько языков, чтобы видеть больше подходящих объявлений</p>
                    <div className="form-group">
                        <div id="myLangsContainer">
                            {["ru", "fi", "en", "it"].map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    className={`lang-select-btn ${languages.includes(lang) ? "active" : ""}`}
                                    onClick={() => toggleLanguage(lang)}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Местоположение */}
                <div className="form-section">
                    <h3>Моё местоположение</h3>
                    <p>Этот параметр не обязателен, но полезен чтобы вам не показывались объявления из других стран или городов</p>
                    <div className="form-group">
                    <label>Местоположение</label>
                        <LocationSelector locationId={locationId} onChange={locationChange} />
                    </div>
                </div>

                {/* Bio */}
                <div className="form-section">
                    <h3>О себе</h3>
                    <div className="form-group">
                        <p>Краткая информация</p>
                        <div className="input-wrapper">
                            <textarea 
                                value={bio}
                                onChange={(e) => changeBio(e.target.value)}
                                maxLength={maxBioLen}
                                rows={4}
                            />
                            <span className="char-counter">{bio.length} / {maxBioLen}</span>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default SettingsPage;
