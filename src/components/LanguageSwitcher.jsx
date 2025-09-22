import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { useState } from "react";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || "fi";

    const [isOpen, setOpen] = useState(false);

    function toggleLangMenu() {
        setOpen(!isOpen);
    }

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("i18nextLng", lng)
        setOpen(false);
    };

    const langMap = {
        ru: { label: "Русский"},
        fi: { label: "Suomi"},
        en: { label: "English"}/* ,
        it: { label: "Italiano"}, */
    };

    return (
        <div className="language-toggle">
            <input type="checkbox" id="langToggle" onClick={() => toggleLangMenu()}/>
            <label htmlFor="langToggle" className="lang-wrapper">
                <div className={`lang-button ${isOpen ? "active" : ""}`}>
                    <img src={`/images/flags/${currentLang}.png`} alt={currentLang} className="flag-icon"/>
                </div>
                <div className={`lang-dropdown ${isOpen ? "active" : ""}`}>
                    {Object.entries(langMap).map(([code, { label }]) => (
                        <a
                            href="#"
                            key={code}
                            className={currentLang === code ? "active" : ""}
                            onClick={(e) => {
                                e.preventDefault();
                                changeLanguage(code);
                            }}
                        >
                            <img src={`/images/flags/${code}.png`} alt="IT" className="flag-icon"/>
                            <span>{label}</span>
                        </a>
                    ))}
                </div>
            </label>
        </div>
    );
};

export default LanguageSwitcher;