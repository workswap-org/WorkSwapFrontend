import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import NotificationsContainer from "./NotificationsContainer";

const NotificationHeaderButton = () => {

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [unreadCount, setUnredCount] = useState(0);

    useEffect(() => {
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
    }, []);

    return (
        <div className="notification-container">
            <button
                className="nav-link"
                id="notificationBtn"
                onClick={() => setOpen(!open)}
            >
                <i className="fa fa-bell fa-lg" aria-hidden="true"></i>
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