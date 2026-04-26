"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { languagesList } from "@core/lib/constants/languages";
import Modal from "../ui/Modal/Modal";

const LanguageSelectModal = () => {
    const [isOpen, setOpen] = useState(false)
    const { i18n } = useTranslation();
    // Empty component placeholder
    const changeLanguage = (lng: string) => {
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
            onClose={() => {}}
            title="Select Language"
        >
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