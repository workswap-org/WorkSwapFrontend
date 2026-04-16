"use client"

import Avatar from "@core/components/common/Avatar/Avatar";
import { ChatType } from "@core/lib/constants/chatTypes";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { IChat, IChatMessage } from "@core/lib/types/messenger";
import { IShortListing } from "@core/lib/types/models/listing";
import { IShortUser } from "@core/lib/types/models/user";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./DialogItem.module.scss"
import sharedStyles from "../ChatShared.module.scss"

interface DialogItemProps {
    chat: IChat,
    pageLoading: boolean,
    setPageLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogItem = ({ chat, pageLoading, setPageLoading }: DialogItemProps) => {
    
    const {user} = useAuth();
    
    const searchParams = useSearchParams();
    const startChatId = Number(searchParams.get("chatId")) || null;
    const isMobile = window.innerWidth <= 600;

    const { currentChatId, setCurrentChatId, unreadMessages } = useChats();
    const [loading, setLoading] = useState(false);

    const interlocutor = useMemo<IShortUser | null>(
        () => chat?.interlocutors?.find(i => i.id != user?.id) ?? null, [chat]);

    const listing = useMemo<IShortListing | null>(() => chat?.listing ?? null, [chat]);

    const unreadForChat = useMemo<IChatMessage[]>(
        () => unreadMessages?.filter(m => m.chatId === chat.id) ?? [],
        [unreadMessages, chat.id]
    );

    const lastMessage = useMemo<IChatMessage | null>(
        () =>
            unreadForChat.length > 0
                ? unreadForChat.reduce((latest, msg) =>
                    new Date(msg.sentAt ?? 0).getTime() > new Date(latest.sentAt ?? 0).getTime() ? msg : latest
                )
                : null,
        [unreadForChat]
    );
        
    useEffect(() => {

        if(!loading && startChatId == chat.id && pageLoading) {
            setPageLoading(false);
            setCurrentChatId(chat.id);
            return;
        } 

        if(!loading && !startChatId && !currentChatId && pageLoading && !isMobile) {

            setPageLoading(false);
            setCurrentChatId(chat.id);
            return;
        }

    }, [setCurrentChatId, loading, chat, startChatId, interlocutor, currentChatId, pageLoading, setPageLoading, isMobile]);

    const formattedDate = chat.lastMessageTime 
        ? new Date(chat.lastMessageTime).toLocaleDateString('ru-RU')
        : "";

    const preview = useMemo(() => {
        if (!lastMessage?.sentAt) return chat.lastMessageText;
        return new Date(chat.lastMessageTime) > new Date(lastMessage.sentAt)
            ? chat.lastMessageText
            : lastMessage.text;
    }, [chat.lastMessageTime, chat.lastMessageText, lastMessage?.sentAt]);

    return (
        <div className={styles.box}>
            <div className={`${styles.dialog} ${chat.id === currentChatId ? styles.active : ""}`} onClick={() => setCurrentChatId(chat.id)}>
                {chat.type == ChatType.LISTING_DISCUSSION && listing ? (
                    <div className={sharedStyles.dialogAvatar}>
                        <img className={sharedStyles.listingImg} src={listing.imagePath} />
                        <Avatar user={interlocutor} size={40} className={sharedStyles.userAvatar} link={false} />
                    </div>
                ) : (
                    <Avatar user={interlocutor} size={50} link={false} />
                )}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h4>{interlocutor?.name}</h4>
                        <span className={styles.time}>{formattedDate}</span>
                    </div>
                    <div className={styles.meta}>
                        <p className={styles.preview}>{preview}</p>
                        {unreadForChat.length > 0 && <span className={styles.unreadCount}>{unreadForChat.length}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DialogItem;