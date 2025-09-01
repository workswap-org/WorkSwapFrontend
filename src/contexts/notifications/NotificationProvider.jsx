import { useState, useRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { NotificationContext } from "./NotificationContext";
import PopupNotification from "@/components/notifications/PopupNotification";

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const nodeRefs = useRef({}); // хранить refs по id уведомлений

    const notificate = (message, type = "info") => {
        const id = Date.now();
        const notification = { id, message, type };
        setNotifications((prev) => [...prev, notification]);

        setTimeout(() => {
            deleteNotification(id);
        }, 30000);
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        delete nodeRefs.current[id]; // чистим ref после удаления
    };

    return (
        <NotificationContext.Provider value={notificate}>
            {children}
            <div className="popup-notification-list">
                <TransitionGroup component={null}>
                    {notifications.map((n) => {
                        if (!nodeRefs.current[n.id]) {
                            nodeRefs.current[n.id] = { current: null };
                        }

                        return (
                            <CSSTransition
                                key={n.id}
                                nodeRef={nodeRefs.current[n.id]}
                                timeout={300}
                                classNames="popup-notification-animate"
                            >
                                <div ref={nodeRefs.current[n.id]}>
                                    <PopupNotification
                                        onClose={() => deleteNotification(n.id)}
                                        notification={n}
                                    />
                                </div>
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </div>
        </NotificationContext.Provider>
    );
};