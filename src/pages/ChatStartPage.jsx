import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, getChat } from "@core/lib";

const ChatStartPage = () => {

    const { user } = useAuth();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const sellerId = params.get("sellerId") || undefined;
    const listingId = params.get("listingId") || undefined;

    const [chat, setChat] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
    
        if (!sellerId || !user) return;

        const newParams = {};
        if (sellerId) newParams.sellerId = sellerId;
        if (listingId) newParams.listingId = listingId;

        async function loadChat() {
            const data = await getChat(newParams);
            setChat(await data.chatId);
        }

        loadChat();
        
    }, [sellerId, listingId, user]);

    useEffect(() => {
        if(chat) {
            navigate(`/secure/messenger?chatId=${chat}`, { replace: true})
        }
    }, [chat, navigate])

    return (
        <div>
        </div>
    );
};

export default ChatStartPage;