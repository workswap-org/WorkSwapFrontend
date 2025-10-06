import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "@core/lib/services/apiClient";
import { useAuth } from "@core/lib/contexts/AuthContext";

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

        async function getChat() {
            const data = await apiFetch(`/api/chat/get`, {}, newParams);
            setChat(await data.chatId);
        }

        getChat();
        
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