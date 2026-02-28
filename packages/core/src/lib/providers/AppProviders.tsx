"use client";

import { AuthProvider } from "./AuthProvider.tsx";
import { WebSocketProvider } from "./WebSocketProvider.tsx";
import { NotificationProvider } from "./NotificationProvider.tsx";
import { ActivePageProvider } from "./ActivePageProvider";
import { MessengerProvider } from "./MessengerProvider.tsx";
import { ReactNode } from "react";

export const AppProviders = ({ children }: {children: ReactNode}) => {
    return (
        <AuthProvider>
            <WebSocketProvider>
                <MessengerProvider>
                    <NotificationProvider>
                        <ActivePageProvider>
                            {children}
                        </ActivePageProvider>
                    </NotificationProvider>
                </MessengerProvider>
            </WebSocketProvider>
        </AuthProvider>
    );
};