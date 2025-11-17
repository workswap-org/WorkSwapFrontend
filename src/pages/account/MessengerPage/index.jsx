import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
    useWebSocket,
    deleteTemporaryChats,
    useChats,
} from "@core/lib";
import { PublicListingCard } from "@/components";
import ChatContainer from "./ChatContainer";
import DialogItem from "./chat/DialogItem";

const MessengerPage = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const { currentChatId, setCurrentChatId, chatListing, chatListingVisible, chats, setInterlocutor } = useChats();

    const { i18n, t } = useTranslation('common');
    const userLocale = i18n.language || "fi";
    const [startChatId, setStartChatId] = useState(params.get("chatId") || undefined);
    
    const [mobileDialogs, setMobileDialogs] = useState(false);

    const { client, connected } = useWebSocket();

    useEffect(() => {
        return () => {
            deleteTemporaryChats();
        }
    }, []);

    useEffect(() => {
        if (!currentChatId || !client || !client.active || !connected) return;

        client.publish({
            destination: `/app/chat.markAsRead/${currentChatId}`
        });

        const url = new URL(window.location);
        url.searchParams.set("chatId", currentChatId);
        window.history.pushState({}, '', url);
        
    }, [currentChatId, client, connected, userLocale]);

    const changeChat = useCallback((chatId, interlocutor) => {
        setCurrentChatId(chatId);
        setInterlocutor(interlocutor)
        setStartChatId(chatId)
        setMobileDialogs(false)
    }, [setCurrentChatId, setInterlocutor])

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
                    {chats.length === 0 ? (
                        <div className="no-dialogs" id="no-dialogs">
                            <p>{t(`messenger.placeholders.noDialogs`, { ns: 'common' })}</p>
                            <p>{t(`messenger.placeholders.startChats`, { ns: 'common' })}</p>
                        </div>
                    ) : chats
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
                
                <ChatContainer showMobileDialogs={() => setMobileDialogs(true)} />
            </div>
        </>
    );
};

export default MessengerPage;