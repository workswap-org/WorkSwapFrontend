import { AuthProvider } from "./AuthProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import { NotificationProvider } from "./NotificationProvider";

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