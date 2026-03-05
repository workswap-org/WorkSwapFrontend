import { INotification } from "@core/lib/types/notification"

interface NotificationItemProps {
    notification: INotification;
    onRead: (n: INotification) => void;
}

const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
    return (
        <div
            className={`notification-item ${notification.importance?.toLowerCase() || "info"} ${!notification.read ? "unread" : ""}`}
            onClick={() => onRead(notification)}
        >
            <div className="notification-text">
                <strong className="title">{notification.title}</strong>
                <span className="content">{notification.content}</span>
            </div>
        </div>
    );
};

export default NotificationItem;