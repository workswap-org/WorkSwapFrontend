const PopupNotification = ({ onClose, notification }) => {
    if (!notification) return null;

    return (
        <div className={`popup-notification ${notification.type}`}>
            {notification.message}
            <button className="close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
    );
};

export default PopupNotification;