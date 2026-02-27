import { useEffect, useState } from "react";
import NotificationsContainer from "./NotificationsContainer";
import { useNotification } from "@core/lib";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";

const NotificationMobileButton = () => {

    const { t } = useTranslation('common');

    const { unreadNotificationsCount } = useNotification();
    const location = useLocation();
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [location]);

    return (
        <>
            <button 
                className="navbar-btn" 
                onClick={() => setOpen(!isOpen)}
                id="notificationAnchor"
            >
                <div><i className="fa-regular fa-bell fa-lg"></i></div>
                <span>{t(`menu.notifications`, { ns: 'buttons' })}</span>
                {unreadNotificationsCount > 0 && (
                    <span id="unreadNotifications" className="unread-notifications-count">
                        {unreadNotificationsCount}
                    </span>
                )}
            </button>
            <NotificationsContainer isOpen={isOpen} onClose={() => setOpen(false)} />
        </>
    );
};

export default NotificationMobileButton;