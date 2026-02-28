import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, chatService, useChatsLoad, useChats } from "@core/lib";

const ChatStartPage = () => {

    const { user } = useAuth();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const interlocutorId = Number(params.get("interlocutorId")) || null;
    const listingId = Number(params.get("listingId")) || null;

    const [chatId, setChatId] = useState(0);
    const navigate = useNavigate();
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
            navigate(`/account/messenger?chatId=${chatId}`, { replace: true})
        }
    }, [chatId, navigate, setCurrentChatId]);

    return (
        <>
        </>
    );
};

export default ChatStartPage;