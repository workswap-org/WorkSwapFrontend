"use client";

import { useEffect, useMemo, useState } from "react";
import { MessengerContext } from "../contexts/MessengerContext";
import { useAuth } from "../contexts/AuthContext";
import { Order } from "../types/models/order";
import { IChat, IChatMessage } from "../types/messenger";
import { useWebSocket } from "../contexts/WebSocketContext";
import useMessengerState from "../hooks/messenger/useMessengerState";

export const MessengerProvider = ({ children }: { children?: React.ReactNode }) => {

    const {user} = useAuth();
    const { allMessages, setAllMessages, messages, currentChat, 
        currentChatId, setCurrentChatId, chats, setChats, 
        pushMessages, pushDetails, pushChats, updateChat
    } = useMessengerState();

    const [chatListingVisible, setChatListingVisible] = useState<boolean>(false);
    const [order, setOrder] = useState<Order | null>(null);
    const { client, connected } = useWebSocket();

    const unreadMessages = useMemo<IChatMessage[] | null>(() => {
        if (!allMessages) return null;
        return allMessages.filter(m => m.read === false && m.senderId != user?.id);
    }, [allMessages]);

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
        
    }, [currentChatId, client, connected]);

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
            pushMessages,
            unreadMessages,
            pushDetails,
            pushChats,
            updateChat
        }}>
            {children}
        </MessengerContext.Provider>
    );
};