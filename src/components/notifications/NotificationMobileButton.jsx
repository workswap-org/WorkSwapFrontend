import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import NotificationsContainer from "./NotificationsContainer";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";

const NotificationMobileButton = () => {

    const { isAuthenticated } = useAuth();
    const { t } = useTranslation('common');

    const [notifications, setNotifications] = useState([]);
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [unreadCount, setUnredCount] = useState(0);

    useEffect(() => {
        const newUnreadCount = notifications.filter(n => !n.read).length;
        if (unreadCount > newUnreadCount) {
            setTimeout(() => {
                setUnredCount(unreadCount - 1);
            }, 70)
        }
    }, [notifications, unreadCount]);

    useEffect(() => {
        setOpen(false);
    }, [location]);
    
    useEffect(() => {

        if (!isAuthenticated) return;

        async function loadNotifications() {
            try {
                const data = await apiFetch(`/api/notifications/for-user`);
                const notifs = data.notifications || [];
                setNotifications(notifs);
                setUnredCount(notifs.filter(n => !n.read).length)
            } catch (err) {
                console.error(err);
                setNotifications([]);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }

        loadNotifications();
    }, [isAuthenticated]);

    return (
        <>
            <button className="navbar-btn" onClick={() => setOpen(!open)}>
                <div><i className="fa-regular fa-bell fa-lg"></i></div>
                <span>{t(`menu.notifications`, { ns: 'buttons' })}</span>
                {unreadCount > 0 && (
                    <span id="unreadNotifications" className="unread-notifications-count">
                        {unreadCount}
                    </span>
                )}
            </button>
            {open && (
                <NotificationsContainer
                    loading={loading} 
                    notifications={notifications} 
                    setNotifications={setNotifications}
                />
            )}
        </>
    );
};

export default NotificationMobileButton;