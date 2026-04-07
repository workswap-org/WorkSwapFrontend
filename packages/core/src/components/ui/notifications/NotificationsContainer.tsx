"use client"

import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem.tsx";
import { createPortal } from "react-dom";
import { useNotification } from "@core/lib/contexts/NotificationContext.tsx";
import { useChats } from "@core/lib/contexts/MessengerContext.tsx";
import { notificationService } from "@core/lib/services/notificationService.ts";
import { INotification } from '@core/lib/types/notification.ts';
import { useWebSocket } from '@core/lib/contexts/WebSocketContext.tsx';
import { useRouter } from 'next/navigation';

interface NotificationsContainerProps {
    isOpen: boolean;
    onClose: () => void
}

const NotificationsContainer = ({ isOpen, onClose }: NotificationsContainerProps) => {

    const { loading, notifications, setNotifications } = useNotification();

    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const [messengerNotification, setMessengerNotification] = useState<INotification | null>(null);
    const { unreadMessages } = useChats();
    const isMobile = window.innerWidth <= 600;
    const router = useRouter();
    const { client, connected } = useWebSocket();

    const markAsRead = async (notification: INotification) => {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) => {
            if (!prev) return prev;
            return prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        })
        if (connected && client) {
            console.log("отмечаем прочитанным уведомление", notification.id)
            client.publish({
                destination: `/app/notifications.readNotification/${notification.id}/`,
                body: ""
            });
        }
        router.push(notification.link);
    }

    useEffect(() => {
        setModalRoot(document.getElementById("modal-root"));
    }, []);

    useEffect(() => {
        if (!unreadMessages || unreadMessages.length == 0) setMessengerNotification(null);
        setMessengerNotification({
            id: 0,
            title: "Новые сообщения: " + (unreadMessages?.length ?? 0),
            content: unreadMessages ? unreadMessages[0]?.text : "Нажми чтобы посмотреть",
            createdAt: new Date().toISOString(),
            type: 'CHAT',
            isRead: false,
            link: "/account/messenger",
            recipientId: 0,
            importance: "INFO"
        })
    }, [unreadMessages])

    if (!modalRoot) return null;

    const content = (
        <div className={`notifications-modal ${isOpen ? "active" : ""}`}>
            <div className="notifications-header">
                <h3>Уведомления</h3>
                <button className="close-btn" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="notifications-list">
                {loading && <p className="empty">Загрузка...</p>}
                {!loading && notifications?.length === 0 && <p className="empty">Нет уведомлений</p>}
                {!loading && messengerNotification && !!unreadMessages?.length && unreadMessages?.length > 0 &&
                    <NotificationItem
                        notification={messengerNotification}
                        onRead={(n) => redirect(n.link)}
                    />
                }
                {!loading && notifications?.map(n => (
                    <NotificationItem key={n.id} notification={n} onRead={(notification) => markAsRead(notification)} />
                ))}
            </div>
        </div>
    );

    return isMobile ? createPortal(content, modalRoot) : content;
};

export default NotificationsContainer;