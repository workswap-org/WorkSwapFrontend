import { useCallback, useEffect, useState } from "react";
import { useWebSocket, useChats, useAuth, IChatDetails, IChat } from "@core/lib";
import { useTranslation } from "react-i18next";
import { IMessage } from '@stomp/stompjs';

export function useChatsLoad() {

    const { setChats, pushDetails, chats } = useChats();
    const [details, setDetails] = useState<IChatDetails[] | null>(null)
    const [detalized, setDetalized] = useState<boolean>(false);
    const { isAuthenticated } = useAuth();
    const { client, connected } = useWebSocket();
    const { i18n } = useTranslation();
    const locale = i18n.language || "fi";

    const reloadChats = useCallback(() => {
        console.log("Перезагружаем чаты")
        if (client && connected) {
            client.publish({
                destination: "/app/chat.get-chats",
                body: JSON.stringify({})
            });
        }
    }, [client]);

    useEffect(() => {
        console.log(chats, detalized, details)
        if (!chats || detalized || !details) return;
        console.log("детализируем чаты в ChatsLoad")
        pushDetails(details)
        setDetalized(true);

    }, [chats, detalized, details])

    useEffect(() => {

        if (!client || !connected || !isAuthenticated) return;

        const chatsSub = client.subscribe("/user/queue/chats", (message) => {
            const loadedChats: IChat[] = JSON.parse(message.body);

            console.log("Загрузились чаты")

            setChats(prev => {
                const updatedChatsMap = new Map(prev?.map(c => [c.id, c]));

                loadedChats.forEach(chat => {
                    // если чат уже есть — обновляем, иначе добавляем
                    updatedChatsMap.set(chat.id, chat);
                });

                // новые чаты в начале
                const updatedChats = Array.from(updatedChatsMap.values());
                // можно сортировать по времени или оставить в порядке добавления
                return updatedChats;
            });
        });

        const detailsSub = client.subscribe(`/user/queue/chats/details`, (response: IMessage) => {
            setDetails(JSON.parse(response.body))
            console.log("Пришли детали чата")
        });

        client.subscribe("/user/queue/chat.chats-updates", (message) => {
            const update = JSON.parse(message.body);

            console.log("Обновленяем диалог ", update.id, update)
            // Обновляем конкретный диалог
            setChats(prev => {
                if (!prev) return prev;

                const updatedChatsMap = new Map(prev.map(c => [c.id, c]));

                const oldChat = updatedChatsMap.get(update.id);

                if (oldChat) {
                    // создаём новый объект, сохраняем oldChat.interlocutors и oldChat.listing
                    updatedChatsMap.set(update.id, {
                        ...update,
                        interlocutors: oldChat.interlocutors,
                        listing: oldChat.listing
                    });
                } else {
                    // если чата ещё нет — просто добавляем
                    updatedChatsMap.set(update.id, update);
                }

                return Array.from(updatedChatsMap.values());
            });
        });

        console.log("Подгружаем чаты 1")
        client.publish({
            destination: "/app/chat.get-chats",
            body: JSON.stringify(locale)
        });

        return () => {
            chatsSub.unsubscribe();
            detailsSub.unsubscribe();
        }
    }, [client, connected, isAuthenticated]);

    return { reloadChats };
}