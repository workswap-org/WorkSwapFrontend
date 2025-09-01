const PopupNotification = ({ onClose, notification }) => {
    if (!notification) return null;

    return (
        <div className={`popup-notification ${notification.type}`}>
            {notification.message}
            <button className="ok" onClick={onClose}>Ок</button>
        </div>
    );
};

export default PopupNotification;