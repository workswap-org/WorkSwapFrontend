import { useStompClient } from "@/hooks/messenger/useStompClient";
import { WebSocketContext } from "./WebSocketContext";

export function WebSocketProvider({ children }) {
    const { client, connected } = useStompClient();

    return (
        <WebSocketContext.Provider value={{ client, connected }}>
            {children}
        </WebSocketContext.Provider>
    );
}
