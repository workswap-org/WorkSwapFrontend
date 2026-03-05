"use client"

import { Modal } from "@core/components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { languagesList } from "@core/lib/constants/languages";

const LanguageSelectModal = () => {
    const [isOpen, setOpen] = useState(false)
    const { i18n } = useTranslation();
    // Empty component placeholder
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("i18nextLng", lng);
        setOpen(false);
    };

    useEffect(() => {
        const isLanguage = !!localStorage.getItem("i18nextLng")
        setOpen(!isLanguage);
    }, [])

    return (
        <Modal
            isOpen={isOpen}
        >
            <h2>Select Language</h2>
            {languagesList.map(({ code, label }) => (
                <button
                    key={code}
                    className="btn btn-primary"
                    onClick={() => changeLanguage(code)}
                >
                    <span>{label}</span>
                </button>
            ))}
        </Modal>
    );
};

export default LanguageSelectModal;