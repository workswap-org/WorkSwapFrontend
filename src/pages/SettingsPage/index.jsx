import "#/css/public/pages/settings-page.css"
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";

const SettingsPage = () => {

    const [user, setUser] = useState([]);
    const [countries, setCountries] = useState([]);

    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [bio, setBio] = useState(user.bio || "");
    const [phoneVisible, setPhoneVisible] = useState(user.phoneVisible || false);
    const [emailVisible, setEmailVisible] = useState(user.emailVisible || false);
    const [avatarType, setAvatarType] = useState(user.avatarType || "uploaded");
    const [languages, setLanguages] = useState(user.languages || []);
    const [locationId, setLocationId] = useState(user.location?.id || null);

    // Подсчёт символов
    const maxNameLen = 30;
    const maxPhoneLen = 16;
    const maxBioLen = 1900;

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

    const handlePhoneChange = (e) => {
        setPhone(validatePhone(e.target.value));
    };

    // Языки (переключение кнопок)
    const toggleLanguage = (lang) => {
        setLanguages((prev) =>
            prev.includes(lang)
                ? prev.filter((l) => l !== lang)
                : [...prev, lang]
        );
    };

    // Сабмит
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            name,
            email,
            phone,
            bio,
            phoneVisible,
            emailVisible,
            avatarType,
            languages,
            locationId
        };
        console.log("Submitting:", formData);
        // TODO: axios.post("/secure/settings/update", formData)
    };

    useEffect(() => {

        async function loadUserSettings() {
            const data = await apiFetch("/api/user/current");
            setUser(await data);
        }

        async function loadCountries() {
            const data = await apiFetch("/api/locations/countries");
            setCountries(await data);
        }

        async function loadCities(locId) {
            const data = await apiFetch(`/api/locations/cities/${locId}`);
            setCountries(await data);
        }

        loadCountries();
        loadUserSettings();
    }, [])

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            {/* Имя, Email, Телефон */}
            <div className="form-section">
                <h3>Основная информация</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Имя</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон</label>
                        <div className="input-wrapper">
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
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
                                onChange={(e) => setPhoneVisible(e.target.checked)}
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
                                onChange={(e) => setEmailVisible(e.target.checked)}
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
                        onClick={() => setAvatarType("uploaded")}
                    >
                        <img className="avatar-preview avatar p80-avatar" src={user.avatarUrl || "/images/upload-foto.png"} alt="Моя" />
                        <span>Моя</span>
                    </div>
                    <div
                        className={`avatar-option ${avatarType === "google" ? "selected" : ""}`}
                        onClick={() => setAvatarType("google")}
                    >
                        <img className="avatar-preview avatar p80-avatar" src={user.picture} alt="Google" />
                        <span>Google</span>
                    </div>
                    <div
                        className={`avatar-option ${avatarType === "default" ? "selected" : ""}`}
                        onClick={() => setAvatarType("default")}
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
                <div class="form-group">
                    <div id="myLangsContainer">
                        {["Русский", "Suomi", "English", "Italiano"].map((lang) => (
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
                    <select
                        value={locationId || ""}
                        onChange={(e) => setLocationId(e.target.value)}
                        className="form-control"
                    >
                        <option value="">Выберите локацию</option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.id}>{c.fullName}</option>
                        ))}
                    </select>
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
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={maxBioLen}
                            rows={4}
                        />
                        <span className="char-counter">{bio.length} / {maxBioLen}</span>
                    </div>
                </div>
            </div>

            {/* Кнопки */}
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                <a href="/secure/account" className="btn btn-outline-primary">Отмена</a>
            </div>
        </form>
    );
}

export default SettingsPage;
