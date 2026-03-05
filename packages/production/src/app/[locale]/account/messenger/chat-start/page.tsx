"use client"

import { useAuth } from "@core/lib/contexts/AuthContext";
import { redirect, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useChatsLoad } from "@core/lib/hooks/chat/useChatsLoad"
import { useChats } from "@core/lib/contexts/MessengerContext";
import { chatService } from "@core/lib/services/chatService"

const ChatStartPage = () => {

    const { user } = useAuth();
    const searchParams = useSearchParams();

    const interlocutorId = Number(searchParams.get("interlocutorId")) || null;
    const listingId = Number(searchParams.get("listingId")) || null;

    const [chatId, setChatId] = useState(0);
    const { reloadChats } = useChatsLoad();
    const { setCurrentChatId } = useChats();

    useEffect(() => {
    
        if (!interlocutorId || !user) return;

        if (listingId) {

            async function loadListingChat() {
                if (!listingId) return;
                const data = await chatService.getListingDiscussion(listingId);
                console.log(data);
                reloadChats();
                setChatId(Number(data));
            }

            loadListingChat();
        } else if (interlocutorId) {

            async function loadPrivateChat() {
                if (!interlocutorId) return;
                const data = await chatService.getPrivateChat(interlocutorId);
                console.log(data);
                reloadChats();
                setChatId(Number(data));
            }

            loadPrivateChat();
        }
        
    }, [listingId, user, reloadChats, interlocutorId]);

    useEffect(() => {
        if(chatId) {
            setCurrentChatId(chatId);
            redirect(`/account/messenger?chatId=${chatId}`)
        }
    }, [chatId, setCurrentChatId]);

    return null;
};

export default ChatStartPage;