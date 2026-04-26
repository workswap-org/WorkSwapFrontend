import { GroupedMessages, IChat, IChatDetails, IChatMessage } from "@core/lib/types/messenger";
import { useCallback, useMemo, useState } from "react";

export default function useMessengerState() {
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [chats, setChats] = useState<IChat[] | null>(null);
    const [allMessages, setAllMessages] = useState<IChatMessage[] | null>(null);

    const currentChat = useMemo<IChat | null>(
        () => chats?.find(c => c.id === currentChatId) ?? null,
        [chats, currentChatId]);

    const prepareMessages = useCallback((rawMessages: IChatMessage[]) => {
        const grouped: { senderId: number; messages: IChatMessage[], id: number}[] = [];

        for (const msg of rawMessages) {
            const last = grouped[grouped.length - 1];

            if (last && last.senderId === msg.senderId) {
                last.messages.push(msg);
            } else {
                grouped.push({
                    senderId: msg.senderId,
                    messages: [msg],
                    id: msg.id
                });
            }
        }

        return grouped;
    }, []);

    const messages = useMemo<GroupedMessages[] | null>(() => {
        if (!allMessages) return null;

        const filtered = allMessages
            .filter(m => m.chatId === currentChatId && m.sentAt)
            .sort((a, b) =>
                new Date(a.sentAt!).getTime() - new Date(b.sentAt!).getTime()
            );

        return prepareMessages(filtered);
    }, [allMessages, currentChatId]);

    const pushMessages = useCallback((messages: IChatMessage[] | IChatMessage) => {
    
        setAllMessages(prev => {
            if (!prev) prev = [];
            const messagesToAdd = Array.isArray(messages) ? messages : [messages];

            // создаём карту текущих сообщений по id
            const messagesMap = new Map(prev?.map(m => [m.id, m]));

            // обновляем карту новыми/заменяем существующие
            messagesToAdd.forEach(m => {
                messagesMap.set(m.id, m);
            });

            // возвращаем массив сообщений в том же порядке, что и в карте
            return Array.from(messagesMap.values());
        });
    }, []);

    const pushDetails = useCallback((details: IChatDetails[]) => {
        console.log("детализируем чаты")
        setChats(prev =>
            prev?.map(chat => {
                const detailsForChat = details.find(d => d.chatId === chat.id);
                console.log("detailsForChat", detailsForChat)
                console.log("chat", chat)
                if (!detailsForChat) return chat;

                console.log("updatedchat", { ...chat, ...detailsForChat })
                return { ...chat, ...detailsForChat };
            }) ?? null
        );
    }, []);

    const pushChats = useCallback((loadedChats: IChat[]) => {
        setChats(prev => {
            const map = new Map(prev?.map(c => [c.id, c]));

            loadedChats.forEach(chat => {
                const existing = map.get(chat.id);

                if (existing) {
                    map.set(chat.id, {
                        ...existing,   // сохраняем детали
                        ...chat        // обновляем базовые поля
                    });
                } else {
                    map.set(chat.id, chat);
                }
            });

            return Array.from(map.values());
        });
    }, []);

    const updateChat = useCallback((update: IChat) => {
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
    }, []);

    return {
        allMessages,
        setAllMessages, 
        messages,
        currentChat,
        currentChatId,
        setCurrentChatId,
        chats,
        setChats,
        pushMessages,
        pushDetails,
        pushChats,
        updateChat
    };
}