"use client"

import { useEffect, useState } from "react";
import NotificationsContainer from "./NotificationsContainer";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { usePathname } from "next/navigation";

const NotificationHeaderButton = () => {

    const { unreadNotificationsCount } = useNotification();
    const pathname = usePathname();
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <>
            <button
                id="notificationAnchor"
                className="account-link"
                onClick={() => setOpen(!isOpen)}
            >
                <i className="fa fa-bell fa-xl" aria-hidden="true"></i>
                {unreadNotificationsCount > 0 && (
                    <div id="unreadNotifications" className="unread-notifications-count">
                        {unreadNotificationsCount}
                    </div>
                )}
            </button>
            <NotificationsContainer isOpen={isOpen} onClose={() => setOpen(false)} />
        </>
    );
};

export default NotificationHeaderButton;