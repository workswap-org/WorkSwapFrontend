"use client"

import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { INotification, IPopupNotification } from "../types/notification";

interface NotificationContextProps {
    notificate: (message: string, type?: string) => void;
    notificateFromRes: (res: { message: string; status: string; }) => void;
    notifications: INotification[] | null; 
    loading: boolean;
    setNotifications: Dispatch<SetStateAction<INotification[] | null>>;
    unreadNotificationsCount: number;
    popupNotifications: IPopupNotification[] | null;
    deletePopupNotification: (id: number) => void;
}

export const NotificationContext = createContext<NotificationContextProps | null>(null);

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotification must be used inside NotificationProvider");
    }
    return ctx;
}