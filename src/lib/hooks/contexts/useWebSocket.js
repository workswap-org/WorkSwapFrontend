import { useContext } from "react";
import { WebSocketContext } from "@/lib/contexts/web-socket/WebSocketContext";

export function useWebSocket() {
    return useContext(WebSocketContext);
}