import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { API_BASE } from "@/api/config";
import { useAuth } from "@/lib/contexts/auth/AuthContext";

export function useStompClient() {

    const {user} = useAuth();

    const [connected, setConnected] = useState(false);

    const [error, setError] = useState(false);

    const [client, setClient] = useState(null);

    useEffect(() => {

        if (!user) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.warn("No access token found, cannot connect to WebSocket");
            return;
        }

        const stompClient = new Client({
            webSocketFactory: () => new WebSocket(`${API_BASE.replace(/^http/, 'ws')}/ws`),
            reconnectDelay: 5000,
            debug: (str) => {
                // Полностью отключить логи с токеном
                if (str.includes("Bearer")) {
                    console.log("STOMP:", str.replace(/Bearer [^ ]+/, "access_token=[hidden]"));
                    return;
                }

                // Можно вообще не показывать лишнее
                if (str.startsWith("WebSocket") || str.startsWith("Connection closed")) {
                    console.log("STOMP: [connection closed]");
                    return;
                }

                // Всё остальное оставляем
                console.log("STOMP:", str);
            }
        });

        stompClient.connectHeaders = {
            Authorization: `Bearer ${token}`
        };

        stompClient.onConnect = () => {
            setError(false)
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
            stompClient.activate();
        };

        stompClient.onWebSocketClose = (evt) => {
            console.warn("WebSocket closed", evt);
            setConnected(false);
            setError(true)
        };

        stompClient.activate();

        return () => {
            console.log("🔌 Deactivating WebSocket");
            stompClient.deactivate();
        };
    }, [user]);

    return { client, connected, error };
}