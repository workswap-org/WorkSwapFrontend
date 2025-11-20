import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, getChat, useChatsLoad, useChats } from "@core/lib";

const ChatStartPage = () => {

    const { user } = useAuth();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const sellerId = params.get("sellerId") || undefined;
    const listingId = params.get("listingId") || undefined;

    const [chatId, setChatId] = useState(0);
    const navigate = useNavigate();
    const { reloadChats } = useChatsLoad();
    const { setCurrentChatId } = useChats();

    useEffect(() => {
    
        if (!sellerId || !user) return;

        const newParams = {};
        if (sellerId) newParams.sellerId = sellerId;
        if (listingId) newParams.listingId = listingId;

        async function loadChat() {
            const data = await getChat(newParams);
            console.log(data);
            reloadChats();
            setChatId(data.chatId);
        }

        loadChat();
        
    }, [sellerId, listingId, user, reloadChats]);

    useEffect(() => {
        if(chatId) {
            setCurrentChatId(chatId);
            navigate(`/account/messenger?chatId=${chatId}`, { replace: true})
        }
    }, [chatId, navigate, setCurrentChatId])

    return (
        <>
        </>
    );
};

export default ChatStartPage;