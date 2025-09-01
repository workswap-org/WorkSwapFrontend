import { useContext } from "react";
import { WebSocketContext } from "@/contexts/web-socket/WebSocketContext";

export function useWebSocket() {
    return useContext(WebSocketContext);
}