import { useState } from "react";
import { useTranslation } from "react-i18next";
import { privateChatTypes, useChats } from "@core/lib";
import { PublicListingCard, ChatWindow, DialogItem} from "@/components";

const MessengerPage = () => {

    const { chatListing, chatListingVisible, chats } = useChats();

    const { t } = useTranslation('common');
    const [pageLoading, setPageLoading] = useState(true);

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
                            .filter(c => privateChatTypes.includes(c.type))
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