"use client"

import PublicListingCard from "@/components/ui/cards/PublicListingCard/PublicListingCard";
import ChatWindow from "@/components/ui/chat/ChatWindow";
import DialogItem from "@/components/ui/chat/DialogItem";
import { privateChatTypes } from "@core/lib/constants/chatTypes";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { useChatsLoad } from "@core/lib/hooks/chat/useChatsLoad";
import { useChatSubscription } from "@core/lib/hooks/chat/useChatSubscription";
import { IChat } from "@core/lib/types/messenger";
import { useState } from "react";
import accountStyles from "@/app/[locale]/account/AccountLayout.module.scss"

const MessengerPage = () => {

    const { chatListingVisible, chats, currentChat } = useChats();

    useChatSubscription();
    useChatsLoad();

    const { dict } = useI18n();
    const [pageLoading, setPageLoading] = useState<boolean>(true);

    return (
        <>
            <div className={`${accountStyles.accountHeader} flex-row`}>
                <h2>{dict.common.titles.messenger}</h2>
            </div>

            <div className="messenger-container">
                {currentChat?.listing && (
                    <div 
                        id="listingCardContainer" 
                        className={`listing-card-container appearance-left-animation ${chatListingVisible ? "visible" : ''}`}
                    >
                        <PublicListingCard listing={currentChat?.listing} />
                    </div>
                )}

                <div className="dialogs-list">
                    {chats?.length === 0 ? (
                        <div className="no-dialogs" id="no-dialogs">
                            <p>{dict.common.messenger.placeholders.noDialogs}</p>
                            <p>{dict.common.messenger.placeholders.startChats}</p>
                        </div>
                    ) : chats?.filter((c: IChat) => privateChatTypes.includes(c.type))
                            .slice()
                            .sort((a: IChat, b: IChat) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())
                            .map((chat: IChat) => (
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