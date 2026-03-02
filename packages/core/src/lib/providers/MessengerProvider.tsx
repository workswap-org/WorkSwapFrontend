"use client";

import { useEffect, useMemo, useState } from "react";
import { MessengerContext } from "../contexts/MessengerContext";
import { useTranslation } from "react-i18next";
import { useAuth, useWebSocket } from '../../lib';
import { IChat, GroupedMessages, IChatMessage, Order, IChatDetails } from "../types";

export const MessengerProvider = ({ children }: { children?: React.ReactNode }) => {

    const {user} = useAuth();

    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [chatListingVisible, setChatListingVisible] = useState<boolean>(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [chats, setChats] = useState<IChat[] | null>(null);
    const [allMessages, setAllMessages] = useState<IChatMessage[] | null>(null);
    const { i18n } = useTranslation();
    const userLocale = i18n.language || "fi";
    const { client, connected } = useWebSocket();

    const currentChat = useMemo<IChat | null>(
        () => chats?.find(c => c.id === currentChatId) ?? null,
        [chats, currentChatId]
    );

    const messages = useMemo<GroupedMessages[] | null>(() => {
        if (!allMessages) return null;

        const filtered = allMessages
            .filter(m => m.chatId === currentChatId && m.sentAt)
            .sort((a, b) =>
                new Date(a.sentAt!).getTime() - new Date(b.sentAt!).getTime()
            );

        return prepareMessages(filtered);
    }, [allMessages, currentChatId]);

    const unreadMessages = useMemo<IChatMessage[] | null>(() => {
        if (!allMessages) return null;
        return allMessages.filter(m => m.read === false && m.senderId != user?.id);
    }, [allMessages]);

    function createNewChat(chatId: number) {
        return { id: chatId || null, messages: [], messagesLoaded: false, interlocutor: { id: null, name: "", avatarUrl: "" } }
    }

    function prepareMessages(rawMessages: IChatMessage[]) {
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
    }

    useEffect(() => {
        setAllMessages(null);
        setCurrentChatId(null);
        setChats(null);
    }, [user]);

    useEffect(() => {
        if (!currentChatId || !client || !connected) return;

        client.publish({
            destination: `/app/chat.markAsRead/${currentChatId}`
        });

        const url = new URL(window.location.href);
        url.searchParams.set("chatId", String(currentChatId));
        window.history.pushState({}, '', url);
        
    }, [currentChatId, client, connected, userLocale]);

    function pushMessages(messages: IChatMessage[] | IChatMessage) {

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
    }

    /* useEffect(() => {
        console.log("Чаты изменились: ", chats)
    }, [chats]) */

    function pushDetails(details: IChatDetails[]) {
        /* console.log("детализируем чаты") */
        setChats(prev =>
            prev?.map(chat => {
                const detailsForChat = details.find(d => d.chatId === chat.id);
                if (!detailsForChat) return chat;
                return { ...chat, ...detailsForChat };
            }) ?? null
        );
    }

    return (
        <MessengerContext.Provider value={{
            setAllMessages, 
            messages,
            currentChat,
            currentChatId,
            setCurrentChatId,
            chatListingVisible,
            setChatListingVisible,
            order,
            chats,
            setChats,
            createNewChat,
            pushMessages,
            unreadMessages,
            pushDetails
        }}>
            {children}
        </MessengerContext.Provider>
    );
};