import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/contexts/useWebSocket";

export function useChatSubscription(chatId) {
    const { client, connected } = useWebSocket();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!chatId || !client || !connected || !client.active) return;

        const subscription = client.subscribe(`/topic/history.messages/${chatId}`, (response) => {
            const data = JSON.parse(response.body);
            /* console.log(chatId)
            console.log(data) */
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                setMessages(prev => [...prev, data]);
            }
        });

        const liveChatSubscription = client.subscribe('/topic/messages/' + chatId, function (messageOutput) {
            const data = JSON.parse(messageOutput.body);
            setMessages(prev => [...prev, data]);
        });

        if (connected) {
            client.publish({
                destination: `/app/chat.loadMessages/${chatId}`,
                body: ''
            });
        }

        return () => {
            subscription.unsubscribe();
            liveChatSubscription.unsubscribe();
        }
    }, [chatId, client, connected]);

    return { messages, setMessages };
}