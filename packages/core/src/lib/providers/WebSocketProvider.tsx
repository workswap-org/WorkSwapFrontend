"use client";

import { WebSocketContext } from "@core/lib/contexts/WebSocketContext";
import { ReactNode } from "react";
import { useStompClient } from "@core/lib/hooks/useStompClient";

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const { client, connected } = useStompClient();

    return (
        <WebSocketContext.Provider value={{ client, connected }}>
            {children}
        </WebSocketContext.Provider>
    );
};