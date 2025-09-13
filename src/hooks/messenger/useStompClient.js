import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { API_BASE } from "@/api/config";
import { useAuth } from "@/contexts/auth/AuthContext";

export function useStompClient() {

    const {user} = useAuth();

    const [connected, setConnected] = useState(false);

    const [client, setClient] = useState(null);

    useEffect(() => {

        if (!user) return;

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
            reconnectDelay: 5000,
            debug: (str) => {
                // Полностью отключить логи с токеном
                if (str.includes("access_token")) {
                    console.log("STOMP:", str.replace(/access_token=[^ ]+/, "access_token=[hidden]"));
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

        stompClient.onConnect = () => {
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
        };

        stompClient.activate();

        return () => {
            console.log("🔌 Deactivating WebSocket");
            stompClient.deactivate();
        };
    }, [user]);

    return { client, connected };
}