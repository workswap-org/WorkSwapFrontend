import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, getListingDiscussion, getPrivateChat, useChatsLoad, useChats } from "@core/lib";

const ChatStartPage = () => {

    const { user } = useAuth();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const interlocutorId = params.get("interlocutorId") || undefined;
    const listingId = params.get("listingId") || undefined;

    const [chatId, setChatId] = useState(0);
    const navigate = useNavigate();
    const { reloadChats } = useChatsLoad();
    const { setCurrentChatId } = useChats();

    useEffect(() => {
    
        if (!interlocutorId || !user) return;

        const newParams: { listingId: number | null, interlocutorId: string | null} = { listingId: null, interlocutorId: null };

        if (listingId) {
            newParams.listingId = Number(listingId);

            async function loadListingChat() {
                const data = await getListingDiscussion(newParams);
                console.log(data);
                reloadChats();
                setChatId(data);
            }

            loadListingChat();
        } else if (interlocutorId) {
            newParams.interlocutorId = interlocutorId;

            async function loadPrivateChat() {
                const data = await getPrivateChat(newParams);
                console.log(data);
                reloadChats();
                setChatId(data);
            }

            loadPrivateChat();
        }
        
    }, [listingId, user, reloadChats, interlocutorId]);

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