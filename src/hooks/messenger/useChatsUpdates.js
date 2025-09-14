import { useEffect } from "react";

export function useChatsUpdates(stompClient, connected, chats, setChats, currentChatId) {
    
    useEffect(() => {
        if (!stompClient || !connected) return;

        const subscription = stompClient.subscribe("/user/queue/chats.updates", (message) => {
            const update = JSON.parse(message.body);

            // Обновляем конкретный диалог
            setChats(prev => {
                const index = prev.findIndex(c => c.id === update.id);
                if (index >= 0) {
                    const newChats = [...prev];
                    newChats[index] = update;
                    return newChats;
                }
                return prev;
            });

            // Перемещаем чат наверх, если есть новое сообщение
            if (update.hasNewMessage) {
                setChats(prev => {
                    const index = prev.findIndex(c => c.id === update.id);
                    if (index >= 0) {
                        const newChats = [...prev];
                        const [chat] = newChats.splice(index, 1);
                        return [chat, ...newChats];
                    }
                    return prev;
                });
            }
        });

        return () => {
            console.log("Отсписались от чатов")
            subscription.unsubscribe();
        }
    }, [stompClient, chats, currentChatId, setChats, connected]);
}