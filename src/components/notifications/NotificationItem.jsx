import { Link } from "react-router-dom";

const NotificationItem = ({ notification, onRead }) => {
    const handleVisible = (el) => {
        if (el && !notification.read) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onRead(notification.id);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });

            observer.observe(el);
        }
    };

    return (
        <Link
            ref={handleVisible}
            to={notification.link || "#"}
            className={`notification-center-item ${notification.importance.toLowerCase()} ${!notification.read ? "notification-unread" : ""}`}
        >
            <div className="notification-content">
                <strong>{notification.title}</strong><br/>
                <span>{notification.content}</span>
            </div>
        </Link>
    );
};

export default NotificationItem;