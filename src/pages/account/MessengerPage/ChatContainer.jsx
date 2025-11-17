import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
    useWebSocket,
    useChats
} from "@core/lib";
import { Avatar } from "@core/components";
import Message from "./chat/Message";
import SendMessageArea from "./chat/SendMessageArea";

const ChatContainer = ({
    showMobileDialogs
}) => {

    const { t } = useTranslation('common')

    const { messages, chatListing, setChatListingVisible, interlocutor } = useChats();

    const { error } = useWebSocket();

    const messagesContainer = useRef(null);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-window">
            <div className="chat-container">
                <div className="chat-header">
                    <div className="chat-user">
                        <button 
                            id="dialogsToggleBtn" 
                            onClick={() => showMobileDialogs()} 
                            className="mobile-dialogs-toggle"
                        >
                            <i className="fa-regular fa-arrow-left fa-2xl"></i>
                        </button>
                        <Avatar user={interlocutor} size={50} />
                        <div>
                            <h4 id="interlocutorName">{interlocutor?.name}</h4>
                            <p className="user-status"></p>
                        </div>
                    </div>
                    <div className="mobile-chat-actions">
                        <Link 
                            to={`/profile/${interlocutor?.id}`} 
                            className="btn btn-outline-primary btn-sm"
                        >
                            <i className="fa-regular fa-user fa-lg"></i>
                        </Link>
                        {chatListing && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
                            >
                                <i className="fa-regular fa-cards-blank fa-lg"></i>
                            </button>
                        )}
                    </div>
                    <div className="chat-actions">
                        {/* <button className="btn btn-outline-danger btn-sm">Заблокировать</button> */}
                        <Link 
                            to={`/profile/${interlocutor?.id}`} 
                            className="btn btn-outline-primary btn-sm"
                        >
                            {t(`messenger.profile`, { ns: 'buttons' })}
                        </Link>
                        {chatListing && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
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

                    {/* <div className="chat-order">
                        <span>Заказ #{order?.id} создан</span>
                    </div> */}
                    {/* <div className="message-date">Сегодня</div> */}

                    {(messages?.length === 0 && !error) && (
                        <p>{t(`fallbacks.noMessages`, { ns: 'common' })}</p>
                    )}

                    {messages?.map((message) => (
                        <Message 
                            key={message.id}
                            message={message} 
                        />
                    ))}
                </div>

                <SendMessageArea/>
            </div>
        </div>
    );
};

export default ChatContainer;