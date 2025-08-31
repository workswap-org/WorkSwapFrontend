import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/contexts/useWebSocket";

export function useChatSubscription(chatId) {
    const { client, connected } = useWebSocket();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!chatId || !client || !connected || !client.active) return;

        const subscription = client.subscribe(`/topic/history.messages/${chatId}`, (response) => {
            const data = JSON.parse(response.body);
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                setMessages(prev => [...prev, data]);
            }
        });

        if (connected) {
            client.publish({
                destination: `/app/chat.loadMessages/${chatId}`,
                body: ''
            });
        }

        return () => subscription.unsubscribe();
    }, [chatId, client, connected]);

    const sendMessage = (text) => {
        client.publish({
            destination: `/app/chat.sendMessage/${chatId}`,
            body: JSON.stringify({ text })
        });
    };

    return { messages, sendMessage };
}