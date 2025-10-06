import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Modal from "@/components/ui/modal/Modal";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { useTranslation } from 'react-i18next';

const ContactModal = () => {

    const location = useLocation();
    const {notificate} = useNotification();

    const [isOpen, setOpen] = useState(false)

    const { t } = useTranslation('navigation')
    
    function toggleModal() {
        setOpen(!isOpen);
    }

    useEffect(() => {
        setOpen(false);
    }, [location]);

    return (
        <>
            <div className="navbar-btn hover" onClick={() => toggleModal()}>
                <div className="icon-defender"><i className="fa-regular fa-lightbulb-on fa-lg"></i></div>
                {t(`menu.helpBeBetter`, { ns: 'buttons' })}
            </div>

            <Modal
                isOpen={isOpen}
                onClose={toggleModal}
                title={t(`menu.contactToSupport`, { ns: 'buttons' })}
            >
                <Link
                    to={`/secure/chat-start?sellerId=1`} 
                    className="btn btn-primary"
                >
                    {t(`listing.contactToAuthor`, { ns: 'buttons' })}
                </Link>
                
                <div 
                    className="navbar-btn"
                    onClick={() => {
                        navigator.clipboard.writeText("workswap.org@gmail.com")
                            .then(() => notificate(t(`notification.success.copyEmail`, { ns: 'messages' }), "success"))
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
                            .then(() => notificate(t(`notification.success.copyTelegramTag`, { ns: 'messages' }), "success"))
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