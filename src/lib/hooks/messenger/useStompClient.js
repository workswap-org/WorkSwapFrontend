import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { API_BASE } from "@/api/config";
import { useAuth } from "@/lib/contexts/auth/AuthContext";

export function useStompClient() {

    const {user, isAuthenticated} = useAuth();

    const [connected, setConnected] = useState(false);

    const [error, setError] = useState(false);

    const [client, setClient] = useState(null);

    useEffect(() => {
        if (!user || !isAuthenticated) return;

        let reconnectAttempts = 0;
        const maxReconnects = 3;

        const stompClient = new Client({
            webSocketFactory: () => new WebSocket(`${API_BASE.replace(/^http/, 'ws')}/ws`),
            reconnectDelay: 5000,
            debug: (str) => {
                if (str.includes("Bearer")) {
                    console.log("STOMP:", str.replace(/Bearer [^ ]+/, "access_token=[hidden]"));
                    return;
                }
                if (str.startsWith("WebSocket") || str.startsWith("Connection closed")) {
                    console.log("STOMP: [connection closed]");
                    return;
                }
                console.log("STOMP:", str);
            }
        });

        stompClient.onConnect = () => {
            reconnectAttempts = 0; // сброс при успешном подключении
            setError(false);
            console.log("✅ Connected to WebSocket");
            setConnected(true);
            setClient(stompClient);
        };

        stompClient.onDisconnect = () => {
            console.log("🔌 Disconnected");
            setClient(null);
            setConnected(false);
        };

        stompClient.onStompError = (frame) => {
            console.error("❌ Broker error:", frame.headers["message"]);
            // Попробовать переподключиться, если лимит не превышен
            if (reconnectAttempts < maxReconnects) {
                reconnectAttempts++;
                console.warn(`Reconnect attempt ${reconnectAttempts}/${maxReconnects}`);
                stompClient.activate();
            } else {
                console.error("🚫 Max reconnect attempts reached. Stopping.");
                stompClient.deactivate();
            }
        };

        stompClient.onWebSocketClose = (evt) => {
            console.warn("WebSocket closed", evt);
            setConnected(false);
            setError(true);
            if (reconnectAttempts < maxReconnects) {
                reconnectAttempts++;
                console.warn(`Reconnect attempt ${reconnectAttempts}/${maxReconnects}`);
                stompClient.activate();
            } else {
                console.error("🚫 Max reconnect attempts reached. Stopping.");
                stompClient.deactivate();
            }
        };

        stompClient.activate();

        return () => {
            console.log("🔌 Deactivating WebSocket");
            stompClient.deactivate();
        };
    }, [user, isAuthenticated]);

    return { client, connected, error };
}