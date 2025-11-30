import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, getListingDiscussion, getPrivateChat, useChatsLoad, useChats } from "@core/lib";

const ChatStartPage = () => {

    const { user } = useAuth();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const interLocutorId = params.get("interLocutorId") || undefined;
    const listingId = params.get("listingId") || undefined;

    const [chatId, setChatId] = useState(0);
    const navigate = useNavigate();
    const { reloadChats } = useChatsLoad();
    const { setCurrentChatId } = useChats();

    useEffect(() => {
    
        if (!interLocutorId || !user) return;

        const newParams = {};

        if (listingId) {
            newParams.listingId = listingId;

            async function loadListingChat() {
                const data = await getListingDiscussion(newParams);
                console.log(data);
                reloadChats();
                setChatId(data);
            }

            loadListingChat();
        } else if (interLocutorId) {
            newParams.interLocutorId = interLocutorId;

            async function loadPrivateChat() {
                const data = await getPrivateChat(newParams);
                console.log(data);
                reloadChats();
                setChatId(data);
            }

            loadPrivateChat();
        }
        
    }, [listingId, user, reloadChats, interLocutorId]);

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