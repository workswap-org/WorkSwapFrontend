"use client"

import { useEffect, useState } from "react";
import NotificationsContainer from "@core/components/ui/notifications/NotificationsContainer";
import { useNotification } from "@core/lib/contexts/NotificationContext";
import { usePathname } from "next/navigation";
import BellIcon from "@core/components/common/icons/BellIcon";
import styles from "./NavButtons/NavButtons.module.scss"

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
                className={styles.accountLink}
                onClick={() => setOpen(!isOpen)}
            >
                <BellIcon />
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