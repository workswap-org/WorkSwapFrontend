"use client";

import { AuthProvider } from "./AuthProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import { NotificationProvider } from "./NotificationProvider";
import { ActivePageProvider } from "./ActivePageProvider";
import { MessengerProvider } from "./MessengerProvider";
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