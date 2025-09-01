import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { WebSocketProvider } from "@/contexts/web-socket/WebSocketProvider";
import { NotificationProvider } from "@/contexts/notifications/NotificationProvider";

export const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            <WebSocketProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </WebSocketProvider>
        </AuthProvider>
    );
};