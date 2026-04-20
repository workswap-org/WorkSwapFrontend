"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import Modal from "@core/components/ui/Modal/Modal"
import { useI18n } from "@core/lib/contexts/I18nContext";

const ContactModal = () => {

    const {notificate} = useNotification();

    const [isOpen, setOpen] = useState<boolean>(false)

    const { dict } = useI18n()
    function toggleModal() {
        setOpen(!isOpen);
    }

    useEffect(() => {
        setOpen(false);
    }, [usePathname]);

    return (
        <>
            <div className="navbar-btn hover" onClick={() => toggleModal()}>
                <div className="icon-defender"><i className="fa-regular fa-lightbulb-on fa-lg"></i></div>
                {dict.buttons.menu.helpBeBetter}
            </div>

            <Modal
                isOpen={isOpen}
                onClose={toggleModal}
                title={dict.buttons.menu.contactToSupport}
            >
                <Link
                    href={`/account/chat-start?sellerId=1`} 
                    className="btn btn-primary"
                >
                    {dict.buttons.listing.contactToAuthor}
                </Link>
                
                <div 
                    className="navbar-btn"
                    onClick={() => {
                        navigator.clipboard.writeText("workswap.org@gmail.com")
                            .then(() => notificate(dict.messages.notification.success.copyEmail, "success"))
                            .catch(() => notificate("Ошибка", "error"));
                    }}
                >
                    <div><i className="fa-regular fa-envelope fa-lg"></i></div>
                    workswap.org@gmail.com
                </div>

                <div 
                    className="navbar-btn"
                    onClick={() => {
                        navigator.clipboard.writeText('@workswap_official')
                            .then(() => notificate(dict.messages.notification.success.copyTelegramTag, "success"))
                            .catch(() => notificate("Ошибка", "error"));
                    }} 
                >
                    <div><i className="fa-brands fa-telegram fa-lg"></i></div>
                    @workswap_official
                </div>
            </Modal>
        </>
    );
};

export default ContactModal;