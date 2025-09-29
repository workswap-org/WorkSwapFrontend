import Message from "./chat/Message";
import SendMessageArea from "./chat/SendMessageArea";
import { useChatSubscription } from "@/lib/hooks/messenger/useChatSubscription";
import { useRef, useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { useWebSocket } from "@/lib/hooks/contexts/useWebSocket";
import { useTranslation } from 'react-i18next';

const ChatContainer = ({ 
    currentChatId, 
    interlocutor, 
    setChatListing, 
    chatListing, 
    toggleChatListing,
    showMobileDialogs
}) => {

    const { t } = useTranslation('common')

    const { error } = useWebSocket();
    const { messages } = useChatSubscription(currentChatId);

    const messagesContainer = useRef(null);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        async function loadChatListing(currentChatId) {
            const data = await apiFetch(`/api/listing/chat/get/${currentChatId}`)
            setChatListing(data.listing)
        }

        if (currentChatId) loadChatListing(currentChatId);
    }, [currentChatId, setChatListing]);

    return (
        <div 
            className="chat-container"
            data-chat-id="${selectedChat.id}"
        >
            <div className="chat-header">
                <div className="chat-user">
                    <button id="dialogsToggleBtn" onClick={() => showMobileDialogs()} className="mobile-dialogs-toggle">
                        <i className="fa-regular fa-arrow-left fa-2xl"></i>
                    </button>
                    <img className="avatar p50-avatar" src={interlocutor.avatarUrl ?? "/images/avatar-placeholder.png"} alt="Аватар" />
                    <div>
                        <h4 id="interlocutorName">{interlocutor.name}</h4>
                        <p className="user-status"></p>
                    </div>
                </div>
                <div className="mobile-chat-actions">
                    <Link to={`/profile/${interlocutor.id}`} className="btn btn-outline-primary btn-sm">
                        <i className="fa-regular fa-user fa-lg"></i>
                    </Link>
                    {chatListing && (
                        <button className="btn btn-primary btn-sm" onClick={() => toggleChatListing()}>
                            <i className="fa-regular fa-cards-blank fa-lg"></i>
                        </button>
                    )}
                </div>
                <div className="chat-actions">
                    {/* <button className="btn btn-outline-danger btn-sm">Заблокировать</button> */}
                    <Link 
                        to={`/profile/${interlocutor.id}`} 
                        className="btn btn-outline-primary btn-sm"
                    >{t(`messenger.profile`, { ns: 'buttons' })}</Link>
                    {chatListing && (
                        <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => toggleChatListing()}
                        >{t(`messenger.listing`, { ns: 'buttons' })}</button>
                    )}
                </div>
            </div>

            <div 
                className="messages-container" 
                ref={messagesContainer}
            >
                {error && (
                    <div className="web-socket-connection-status">
                        <span>{t(`messenger.connectionLost`, { ns: 'errors' })}</span>
                        <br/>
                        <i className="fa-solid fa-spinner-third fa-spin"></i>
                    </div>
                )}
                {/* <div className="message-date">Сегодня</div> */}

                {(messages.length === 0 && !error) && (
                    <p className="no-messages">{t(`fallbacks.noMessages`, { ns: 'common' })}</p>
                )}
                {messages.map((message) => (
                    <Message 
                        key={message.id}
                        message={message} 
                    />
                ))}
            </div>

            <SendMessageArea currentChatId={currentChatId}/>
        </div>
    );
};

export default ChatContainer;