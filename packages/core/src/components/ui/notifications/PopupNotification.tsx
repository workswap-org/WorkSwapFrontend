import { IPopupNotification } from "@core/lib/types/notification";

interface PopupNotificationProps {
    onClose: () => void;
    notification: IPopupNotification
}

const PopupNotification = ({ onClose, notification }: PopupNotificationProps) => {
    if (!notification) return null;

    return (
        <div className={`popup-notification ${notification.type}`}>
            {notification.message}
            <button className="close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
    );
};

export default PopupNotification;