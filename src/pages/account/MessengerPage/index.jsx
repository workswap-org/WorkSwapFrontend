import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
    useWebSocket,
    deleteTemporaryChats,
    useChats,
    useChatSubscription,
    useChatsLoad
} from "@core/lib";
import { PublicListingCard } from "@/components";
import ChatContainer from "./ChatContainer";
import DialogItem from "./chat/DialogItem";

const MessengerPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const { currentChat, changeCurrentChat, chatListing, chatListingVisible, chats } = useChats();

    const { i18n, t } = useTranslation('common');
    const userLocale = i18n.language || "fi";
    const [startChatId, setStartChatId] = useState(params.get("chatId") || undefined);
    
    const [mobileDialogs, setMobileDialogs] = useState(false);

    const { client, connected } = useWebSocket();

    useChatSubscription();
    useChatsLoad();

    useEffect(() => {
        return () => {
            deleteTemporaryChats();
        }
    }, []);

    useEffect(() => {
        if (!currentChat.id || !client || !client.active || !connected) return;

        client.publish({
            destination: `/app/chat.markAsRead/${currentChat.id}`
        });

        const url = new URL(window.location);
        url.searchParams.set("chatId", currentChat.id);
        window.history.pushState({}, '', url);
        
    }, [currentChat.id, client, connected, userLocale]);

    const changeChat = useCallback((chatId) => {
        changeCurrentChat(chatId);
        setStartChatId(chatId)
        hideMobileDialogs()
    }, [changeCurrentChat])
 
    function showMobileDialogs() {
        setMobileDialogs(true);
    }

    function hideMobileDialogs() {
        setMobileDialogs(false);
    }

    return (
        <>
            <div className="account-header flex-row">
                <h2>{t(`titles.messenger`, { ns: 'common' })}</h2>
            </div>

            <div className="messenger-container">
                {chatListing && (
                    <div 
                        id="listingCardContainer" 
                        className={`listing-card-container appearance-left-animation ${chatListingVisible ? "visible" : ''}`}
                    >
                        <PublicListingCard listing={chatListing} />
                    </div>
                )}

                <div className={`dialogs-list ${mobileDialogs ? "show" : ""}`}>
                    {chats.length === 0 && (
                        <div className="no-dialogs" id="no-dialogs">
                            <p>{t(`messenger.placeholders.noDialogs`, { ns: 'common' })}</p>
                            <p>{t(`messenger.placeholders.startChats`, { ns: 'common' })}</p>
                        </div>
                    )}
                    {chats
                        .slice()
                        .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                        .map(chat => (
                            <DialogItem 
                                key={chat.id}
                                startChatId={startChatId}
                                chat={chat}
                                changeChat={changeChat} 
                            />
                        ))
                    }
                </div>
                
                <ChatContainer showMobileDialogs={showMobileDialogs} />
            </div>
        </>
    );
};

export default MessengerPage;