"use client";

import { useState, useRef, useCallback, useMemo, ReactNode, createRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useNotificationSubscription } from "@core/lib/hooks/notification/useNotificationSubscription";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { NotificationContext } from "@core/lib/contexts/NotificationContext";
import PopupNotification from "@core/components/ui/notifications/PopupNotification";
import { IPopupNotification } from "../types/notification";
import { useI18n } from "../contexts/I18nContext";

export const NotificationProvider = ({ children }: {children?: ReactNode}) => {
    const { loading, notifications, setNotifications, unreadCount } = useNotificationSubscription();

    const [popupNotifications, setPopupNotifications] = useState<IPopupNotification[]>([]);
    const { unreadMessages } = useChats();
    const nodeRefs = useRef<Record<number, React.RefObject<HTMLDivElement | null>>>({});
    const { dict } = useI18n();

    const unreadNotificationsCount = useMemo(() => {
        return unreadCount + (unreadMessages?.length ?? 0)
    }, [unreadCount, unreadMessages]);

    const deletePopupNotification = useCallback((id: number) => {
        setPopupNotifications((prev) => prev.filter(n => n.id !== id));
    }, []);

    const notificate = useCallback((message: string, type = "info") => {
        const id = Date.now();
        const notification = { id, message, type };
        setPopupNotifications((prev) => [...prev, notification]);

        setTimeout(() => {
            deletePopupNotification(id);
        }, 5000);
    }, [deletePopupNotification]);

    const notificateFromRes = useCallback((res: {message: string, status: string}) => {
        const id = Date.now();
        const notification = { 
            id,
            message: dict.messages.notification[res.status][res.message],
            type: res.status || ""
        };
        setPopupNotifications((prev) => [...prev, notification]);

        setTimeout(() => {
            deletePopupNotification(id);
        }, 30000);
    }, [deletePopupNotification]);

    return (
        <NotificationContext.Provider value={{
                notificate, 
                notificateFromRes, 
                notifications, 
                loading, 
                setNotifications, 
                unreadNotificationsCount
            }}
        >
            {children}
            <div className="popup-notification-list">
                <TransitionGroup component={null}>
                    {popupNotifications?.map((n) => {
                        if (!nodeRefs.current[n.id]) {
                            nodeRefs.current[n.id] = createRef<HTMLDivElement>();
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
                                        onClose={() => deletePopupNotification(n.id)}
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