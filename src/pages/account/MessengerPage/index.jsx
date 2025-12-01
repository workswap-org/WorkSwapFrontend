import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { 
    useWebSocket,
    useChats,
} from "@core/lib";
import { PublicListingCard } from "@/components";
import ChatContainer from "./ChatContainer";
import DialogItem from "./chat/DialogItem.tsx";

const MessengerPage = () => {

    const { currentChatId, setCurrentChatId, chatListing, chatListingVisible, chats, setInterlocutor } = useChats();

    const { i18n, t } = useTranslation('common');
    const userLocale = i18n.language || "fi";
    
    const { client, connected } = useWebSocket();
    const [pageLoading, setPageLoading] = useState(true);

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
        setInterlocutor(interlocutor);
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

                <div className="dialogs-list">
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
                                    chat={chat}
                                    setPageLoading={setPageLoading}
                                    pageLoading={pageLoading}
                                    changeChat={changeChat} 
                                />
                            ))
                    }
                </div>
                
                <ChatContainer changeChat={changeChat} />
            </div>
        </>
    );
};

export default MessengerPage;