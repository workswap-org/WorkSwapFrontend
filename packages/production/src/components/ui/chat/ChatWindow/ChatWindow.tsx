"use client"

import { useRef, useEffect, useState, useMemo } from "react";
import SendMessageArea from "../SendMessageArea/SendMessageArea";
import MessagesGroup from "../MessagesGroup/MessagesGroup";
import { createPortal } from "react-dom";
import { useAuth } from "@core/lib/contexts/AuthContext";
import { useActivePage } from "@core/lib/contexts/ActivePageContext";
import { useChats } from "@core/lib/contexts/MessengerContext";
import { IShortUser } from "@core/lib/types/models/user";
import { ChatType, privateChatTypes } from "@core/lib/constants/chatTypes"
import Avatar from "@core/components/common/Avatar";
import Link from "next/link";
import { useI18n } from "@core/lib/contexts/I18nContext";
import styles from "./ChatWindow.module.scss"
import sharedStyles from "../ChatShared.module.scss"

const ChatWindow = ({title}: {title?: string}) => {

    const { dict } = useI18n();
    const { user } = useAuth();

    const activePage = useActivePage();
    const { messages, setChatListingVisible, currentChatId, setCurrentChatId, currentChat } = useChats();

    const chatInterlocutor = useMemo<IShortUser | null>(
        () => currentChat?.interlocutors?.find(i => i.id != user?.id) ?? null, [currentChat]);

    const messagesContainer = useRef<HTMLDivElement  | null>(null);
    const isMobile = window.innerWidth <= 600;

    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.getElementById("modal-root"));
    }, []);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages]);

    function renderChatWindow() {
        return (
            <div id={currentChat?.type} className={`${styles.chatWindow} ${currentChatId ? "show" : ""}`}>
                <div className={styles.chatHeader}>
                    <div className={styles.chatInfo}>
                        <button 
                            id="dialogsToggleBtn" 
                            onClick={() => setCurrentChatId(null)} 
                            className={styles.mobileDialogsToggle}
                        >
                            <i className="fa-regular fa-arrow-left fa-2xl"></i>
                        </button>

                        {currentChat?.type !== undefined &&
                            privateChatTypes.includes(currentChat.type) && (
                            <>
                                {currentChat?.type === ChatType.LISTING_DISCUSSION && currentChat.listing ? (
                                    <div className={sharedStyles.dialogAvatar}>
                                        <img className={sharedStyles.listingImg} src={currentChat?.listing?.imagePath} />
                                        <Avatar user={chatInterlocutor} size={40} className={sharedStyles.userAvatar} link={false} />
                                    </div>
                                ) : (
                                    <Avatar user={chatInterlocutor} size={50} link={false} />
                                )}
                            </>
                        )}
                        <h4 id="chatTitle">{title ?? chatInterlocutor?.name}</h4>
                    </div>
                    <div className={styles.mobileActions}>
                        {chatInterlocutor?.id && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
                            >
                                <i className="fa-regular fa-cards-blank fa-lg"></i>
                            </button>
                        )}
                        <Link
                            href={`/profile/${chatInterlocutor?.openId}`} 
                            className="btn btn-outline-primary btn-sm"
                        >
                            <i className="fa-regular fa-user fa-lg"></i>
                        </Link>
                    </div>
                    <div className={styles.actions}>
                        {currentChat?.listing?.id && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
                            >{dict.buttons.messenger.listing}</button>
                        )}
                        {chatInterlocutor?.openId && (
                            <Link 
                                href={`/profile/${chatInterlocutor?.openId}`} 
                                className="btn btn-outline-primary btn-sm"
                            >
                                {dict.buttons.messenger.profile}
                            </Link>
                        )}
                        
                    </div>
                </div>

                <div 
                    className={styles.messagesContainer} 
                    ref={messagesContainer}
                >
                    {/* {error && (
                        <div className="web-socket-connection-status">
                            <span>{t(`messenger.connectionLost`, { ns: 'errors' })}</span>
                            <br/>
                            <i className="fa-solid fa-spinner-third fa-spin"></i>
                        </div>
                    )} */}

                    {(messages?.length === 0) && (
                        <p>{dict.common.fallbacks.noMessages}</p>
                    )}

                    {messages?.map((group) => (
                        <MessagesGroup group={group} key={group.id} />
                    ))}
                </div>

                <SendMessageArea/>
            </div>
        );
    }

    if (!modalRoot) return null;

    return isMobile && activePage != "event" ? createPortal(renderChatWindow(), modalRoot) : renderChatWindow()
};

export default ChatWindow;