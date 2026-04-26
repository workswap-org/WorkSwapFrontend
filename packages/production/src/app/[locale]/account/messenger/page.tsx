"use client"

import PublicListingCard from "@/components/ui/cards/PublicListingCard/PublicListingCard";
import ChatWindow from "@/components/ui/chat/ChatWindow/ChatWindow";
import DialogItem from "@/components/ui/chat/DialogItem/DialogItem";
import { privateChatTypes } from "@core/lib/constants/chatTypes";
import { useI18n } from "@core/lib/contexts/I18nContext";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { useChatsLoad } from "@core/lib/hooks/chat/useChatsLoad";
import { useChatSubscription } from "@core/lib/hooks/chat/useChatSubscription";
import { IChat } from "@core/lib/types/messenger";
import styles from "./MessengerPage.module.scss"
import AccountHeader from "@/components/pages/account/AccountHeader/AccountHeader";

const MessengerPage = () => {

    const { chatListingVisible, chats, currentChat } = useChats();

    useChatSubscription();
    useChatsLoad();

    const { dict } = useI18n();

    return (
        <>
            <AccountHeader title={dict.common.titles.messenger} />

            <div className={styles.container}>
                {currentChat?.listing && (
                    <div 
                        id="listingCardContainer" 
                        className={`${styles.listingCardContainer} appearance-left-animation ${chatListingVisible ? "visible" : ''}`}
                    >
                        <PublicListingCard listing={currentChat?.listing} />
                    </div>
                )}

                <div className={styles.dialogsList}>
                    {chats?.length === 0 ? (
                        <div className={styles.noDialogs}>
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