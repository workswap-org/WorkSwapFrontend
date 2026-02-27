import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface NotificationContextProps {
    notificate: (message: string, type?: string) => void;
    notificateFromRes: (res: { message: string; status: string; }) => void;
    notifications: INotification[] | null; 
    loading: boolean;
    setNotifications: Dispatch<SetStateAction<INotification[] | null>>;
    unreadNotificationsCount: number;
}

export const NotificationContext = createContext<NotificationContextProps | null>(null);

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotification must be used inside NotificationProvider");
    }
    return ctx;
}