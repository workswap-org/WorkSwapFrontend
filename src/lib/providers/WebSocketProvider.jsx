import { useStompClient } from "@/lib/hooks/messenger/useStompClient";
import { WebSocketContext } from "../contexts/web-socket/WebSocketContext";

export function WebSocketProvider({ children }) {
    const { client, connected } = useStompClient();

    return (
        <WebSocketContext.Provider value={{ client, connected }}>
            {children}
        </WebSocketContext.Provider>
    );
}
