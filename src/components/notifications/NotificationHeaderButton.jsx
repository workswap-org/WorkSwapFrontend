import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import NotificationsContainer from "./NotificationsContainer";
import { useAuth } from "@/lib/contexts/auth/AuthContext";

const NotificationHeaderButton = () => {

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [unreadCount, setUnredCount] = useState(0);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const newUnreadCount = notifications.filter(n => !n.read).length;
        if (unreadCount > newUnreadCount) {
            setTimeout(() => {
                setUnredCount(unreadCount - 1);
            }, 70)
        }
    }, [notifications, unreadCount]);

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
        <div className="notification-container">
            <button
                className="nav-link"
                id="notificationBtn"
                onClick={() => setOpen(!open)}
            >
                <i className="fa fa-bell fa-xl" aria-hidden="true"></i>
                {unreadCount > 0 && (
                    <div id="unreadNotifications" className="unread-notifications-count">
                        {unreadCount}
                    </div>
                )}
            </button>
            {open && (
                <NotificationsContainer
                    loading={loading} 
                    notifications={notifications} 
                    setNotifications={setNotifications}
                />
            )}
        </div>
    );
};

export default NotificationHeaderButton;