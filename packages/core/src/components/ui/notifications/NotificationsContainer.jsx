"use client"

import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem.tsx";
import { apiFetch, notificationService, useChats, useNotification } from "@core/lib";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const NotificationsContainer = ({ isOpen, onClose }) => {

    const { loading, notifications, setNotifications } = useNotification();

    const [modalRoot, setModalRoot] = useState(null);
    const navigate = useNavigate();
    const [messengerNotification, setMessengerNotification] = useState(null);
    const { unreadMessages } = useChats();
    const isMobile = window.innerWidth <= 600;

    const markAsRead = async (notification) => {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
        navigate(notification.link)
    }

    useEffect(() => {
        setModalRoot(document.getElementById("modal-root"));
    }, []);

    useEffect(() => {
        if (!unreadMessages || unreadMessages == []) setMessengerNotification(null);
        setMessengerNotification({
            title: "Новые сообщения: " + (unreadMessages?.length ?? 0),
            content: unreadMessages ? unreadMessages[0]?.text : "Нажми чтобы посмотреть",
            createdAt: new Date().getTime(),
            type: 'CHAT',
            read: false,
            link: "/account/messenger",
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
                {!loading && notifications.length === 0 && <p className="empty">Нет уведомлений</p>}
                {!loading && messengerNotification && unreadMessages?.length > 0 &&
                    <NotificationItem
                        notification={messengerNotification}
                        onRead={(n) => navigate(n.link)}
                    />
                }
                {!loading && notifications.map(n => (
                    <NotificationItem key={n.id} notification={n} onRead={(notification) => markAsRead(notification)} />
                ))}
            </div>
        </div>
    );

    return isMobile ? createPortal(content, modalRoot) : content;
};

export default NotificationsContainer;