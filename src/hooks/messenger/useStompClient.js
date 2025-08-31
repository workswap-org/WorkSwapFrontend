import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { API_BASE } from "@/api/config";

export function useStompClient() {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.warn("No access token found, cannot connect to WebSocket");
            return;
        }

        // Создаём нативный WebSocket вместо SockJS, меняя http/https на ws/wss
        const url = `${API_BASE.replace(/^http/, 'ws')}/ws?access_token=${encodeURIComponent(token)}`;
        const webSocket = new WebSocket(url);

        const stompClient = new Client({
            webSocketFactory: () => webSocket,
            connectHeaders: {
                Authorization: `Bearer ${token}`, // По-прежнему передаём в заголовках
            },
            reconnectDelay: 5000,
            debug: (str) => {
                if (str.startsWith(">>> CONNECT")) {
                    console.log("STOMP: >>> CONNECT [hidden]");
                } else {
                    console.log("STOMP:", str);
                }
            }
        });

        stompClient.onConnect = () => {
            console.log("✅ Connected to WebSocket");
            setConnected(true);
            clientRef.current = stompClient;
        };

        stompClient.onDisconnect = () => {
            console.log("🔌 Disconnected");
            setConnected(false);
        };

        stompClient.onStompError = (frame) => {
            console.error("❌ Broker error:", frame.headers["message"]);
        };

        stompClient.activate();

        return () => {
            console.log("🔌 Deactivating WebSocket");
            stompClient.deactivate();
        };
    }, []);

    return { client: clientRef.current, connected };
}