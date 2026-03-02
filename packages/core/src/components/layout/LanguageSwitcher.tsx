"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { languagesList } from "@core/lib/constants/languages";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || "fi";

    const [isOpen, setOpen] = useState(false);

    function toggleLangMenu() {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        setOpen(false);
    }, [usePathname]);

    const changeLanguage = (lng: string) => {
        if (lng !== currentLang) {
            i18n.changeLanguage(lng);
            localStorage.setItem("i18nextLng", lng);
        }
        setOpen(true);
    };

    return (
        <div className="language-toggle" onClick={toggleLangMenu}>
            <div className={`lang-button ${isOpen ? "active" : ""}`}>
                {currentLang.toUpperCase()}
            </div>
            <div className={`lang-dropdown ${isOpen ? "active" : ""}`}>
                {languagesList.map(({ code, label }) => (
                    <button
                        key={code}
                        type="button"
                        className={`lang-dropdown-item ${currentLang === code ? "active" : ""}`}
                        onClick={() => changeLanguage(code)}
                    >
                        {/* <img src={`/images/flags/${code}.png`} alt="RU" className="flag-icon"/> */}
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSwitcher;