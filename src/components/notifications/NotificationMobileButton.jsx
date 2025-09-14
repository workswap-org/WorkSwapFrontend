import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import NotificationsContainer from "./NotificationsContainer";

const NotificationMobileButton = () => {

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
        <>
            <button className="navbar-btn" onClick={() => setOpen(!open)}>
                <div><i className="fa-regular fa-bell fa-lg"></i></div>
                <span>Уведомления</span>
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