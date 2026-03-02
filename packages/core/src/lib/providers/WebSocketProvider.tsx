"use client";

import { useStompClient } from "@core/lib";
import { WebSocketContext } from "../contexts/WebSocketContext";
import { ReactNode } from "react";

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