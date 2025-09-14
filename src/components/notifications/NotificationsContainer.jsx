import NotificationItem from "./NotificationItem";
import { apiFetch } from "@/lib/apiClient";

const NotificationsContainer = ({
    loading, 
    notifications, 
    setNotifications
}) => {

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
        <>
            <div className="notification-center-dropdown">
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
        </>
    );
};

export default NotificationsContainer;