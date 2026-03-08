"use client"

import { useEffect, useRef } from "react";
import { IMessage } from '@stomp/stompjs';
import { useChats } from "@core/lib/contexts/MessengerContext";
import { useWebSocket } from "@core/lib/contexts/WebSocketContext";
import { useAuth } from "@core/lib/contexts/AuthContext";

export function useChatSubscription() {

    const { currentChatId, pushMessages } = useChats();
    const { client, connected } = useWebSocket();
    const { user, isAuthenticated } = useAuth();

    const loadedChatsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        loadedChatsRef.current = (new Set())
    }, [user]);

    function setMessagesLoaded(chatId: number) {
        loadedChatsRef.current.add(chatId);
    }

    useEffect(() => {
        if (!client || !connected || !isAuthenticated) return;

        const messagesSub = client.subscribe(`/user/queue/chat/messages`, (response: IMessage) => {
            const data = JSON.parse(response.body);
            pushMessages(data);
        });

        console.log("Вызов загрузки уведомлений")
        client.publish({
            destination: `/app/messages.get-unread`,
            body: ''
        });

        return () => {
            messagesSub.unsubscribe();
        };
    }, [client, connected, isAuthenticated]);

    useEffect(() => {
        if (!client?.active || !connected || !currentChatId || !isAuthenticated) return;

        const historySub = client.subscribe(
            `/user/queue/chat/history.messages/${currentChatId}`,
            (response: IMessage) => {
                const data = JSON.parse(response.body);
                pushMessages(data);
                setMessagesLoaded(currentChatId);
            }
        );

        return () => {
            historySub.unsubscribe();
        };
    }, [client?.active, connected, currentChatId, isAuthenticated]);

    useEffect(() => {
        if (
            !client || 
            !connected || 
            !currentChatId || 
            !isAuthenticated ||
            loadedChatsRef.current.has(currentChatId)) {
            return;
        }

        loadedChatsRef.current.add(currentChatId);

        console.log("Вызов загрузки сообщений для " + currentChatId);
        client.publish({
            destination: `/app/chat.loadMessages/${currentChatId}`,
            body: ''
        });
    }, [client, connected, currentChatId, isAuthenticated]);
}