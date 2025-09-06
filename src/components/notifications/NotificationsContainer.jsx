import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { apiFetch } from "@/lib/apiClient";

const NotificationsContainer = () => {
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
            } finally {
                setLoading(false);
            }
        }

        loadNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await apiFetch(`/api/notifications/${id}/read`, { method: "POST" });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error("Ошибка при отметке прочтения", err);
        }
    };

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
                <div id="notificationDropdown" className="notification-center-dropdown">
                    <div className="notification-center-header">Уведомления</div>
                    <div id="notificationList" className="notification-center-list">
                        {loading && <p className="no-notifications">Загрузка...</p>}
                        {!loading && notifications.length === 0 && (
                            <p className="no-notifications">Нет уведомлений</p>
                        )}
                        {!loading &&
                            notifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    onRead={markAsRead}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsContainer;