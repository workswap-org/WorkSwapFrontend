import { useCallback, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { API_BASE } from "@/api/config";
import { useAuth } from "@/lib/contexts/auth/AuthContext";
import { refreshToken } from "@/lib/apiClient";

export function useStompClient() {

    const {user } = useAuth();

    const [connected, setConnected] = useState(false);

    const [error, setError] = useState(false);

    const [client, setClient] = useState(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0)

    const maxReconnects = 3;

    const reconnect = useCallback(async (stompClient) => {

        const res = await refreshToken();
        if (res.ok) {
            if (reconnectAttempts < maxReconnects) {
                setReconnectAttempts(reconnectAttempts + 1);
                console.warn(`Reconnect attempt ${reconnectAttempts}/${maxReconnects}`);
                stompClient.activate();
            } else {
                console.error("🚫 Max reconnect attempts reached. Stopping.");
                stompClient.deactivate();
            }
        } 
    }, [reconnectAttempts])

    const connect = useCallback(() => {

        console.log("Client: ", client)

        if (connected) return;

        const stompClient = new Client({
            webSocketFactory: () => new WebSocket(`${API_BASE.replace(/^http/, 'ws')}/ws`),
            reconnectDelay: 0,
        });

        stompClient.onConnect = () => {
            setReconnectAttempts(0); // сброс при успешном подключении
            setError(false);
            console.log("✅ Connected to WebSocket");
            setConnected(true);
            setClient(stompClient);
        };

        stompClient.onDisconnect = () => {
            /* console.log("🔌 Disconnected"); */
            setClient(null);
            setConnected(false);
        };

        stompClient.onStompError = (frame) => {
            const message = frame.headers["message"];
            console.error("❌ Broker error:", message);
            if (message.includes("invalidToken")) {
                reconnect(stompClient);
            }
        };

        stompClient.onWebSocketClose = (evt) => {
            console.warn("WebSocket closed", evt);
            setConnected(false);
            setError(true);
            /* reconnect(stompClient, reconnectAttempts); */
        };

        stompClient.activate();

        return () => {
            /* console.log("🔌 Deactivating WebSocket"); */
            stompClient.deactivate();
        };
    }, [connected, client, reconnect])

    useEffect(() => {
        if (!user) return;

        connect();

    }, [connect, connected, user]);

    useEffect(() => {
        console.log("Подключение активно? ", connected);
    }, [connected]);

    return { client, connected, error };
}