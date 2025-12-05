import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    useWebSocket,
    useChats,
} from "@core/lib";
import { PublicListingCard, ChatWindow } from "@/components";
import DialogItem from "./DialogItem";

const MessengerPage = () => {

    const { currentChatId, chatListing, chatListingVisible, chats } = useChats();

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

    const allowedTypes = ["LISTING_DISCUSSION", "PRIVATE_CHAT"];

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
                    {chats?.length === 0 ? (
                        <div className="no-dialogs" id="no-dialogs">
                            <p>{t(`messenger.placeholders.noDialogs`, { ns: 'common' })}</p>
                            <p>{t(`messenger.placeholders.startChats`, { ns: 'common' })}</p>
                        </div>
                    ) : chats
                            .filter(c => allowedTypes.includes(c.type))
                            .slice()
                            .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                            .map(chat => (
                                <DialogItem
                                    key={chat.id}
                                    chat={chat}
                                    setPageLoading={setPageLoading}
                                    pageLoading={pageLoading}
                                />
                            ))
                    }
                </div>
                
                <ChatWindow/>
            </div>
        </>
    );
};

export default MessengerPage;