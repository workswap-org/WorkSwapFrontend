"use client"

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { languagesList } from "@core/lib/constants/languages";
import { useI18n } from "@core/lib/contexts/I18nContext";


const LanguageSwitcher = () => {
    const { locale } = useI18n();
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setOpen] = useState(false);

    function toggleLangMenu() {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const changeLanguage = (lng: string) => {
        if (lng === locale) return;

        document.cookie = `locale=${lng}; path=/; max-age=31536000`;

        const segments = pathname.split("/");
        segments[1] = lng; // заменяем locale

        const newPath = segments.join("/") || `/${lng}`;

        router.push(newPath);
    };

    return (
        <div className="language-toggle">
            <div
                className={`lang-button ${isOpen ? "active" : ""}`}
                onClick={toggleLangMenu}
            >
                {locale.toUpperCase()}
            </div>

            <div className={`lang-dropdown ${isOpen ? "active" : ""}`}>
                {languagesList.map(({ code, label }) => (
                    <button
                        key={code}
                        type="button"
                        className={`lang-dropdown-item ${
                            locale === code ? "active" : ""
                        }`}
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