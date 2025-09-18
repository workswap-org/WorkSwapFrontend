import { AuthProvider } from "@/lib/contexts/auth/AuthProvider";
import { WebSocketProvider } from "@/lib/contexts/web-socket/WebSocketProvider";
import { NotificationProvider } from "@/lib/contexts/notifications/NotificationProvider";

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