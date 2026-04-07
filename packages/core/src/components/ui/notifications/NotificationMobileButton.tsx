"use client"

import { useEffect, useState } from "react";
import NotificationsContainer from "./NotificationsContainer";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { usePathname } from "next/navigation";
import BellIcon from "@core/components/common/icons/BellIcon";

const NotificationMobileButton = () => {
 
    const { dict } = useI18n();
    const { unreadNotificationsCount } = useNotification();
    const pathname = usePathname();
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <>
            <button 
                className="navbar-btn" 
                onClick={() => setOpen(!isOpen)}
                id="notificationAnchor"
            >
                <BellIcon />
                <span>{dict.buttons.menu.notifications}</span>
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