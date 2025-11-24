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

const ChatContainer = ({changeChat}) => {

    const { t } = useTranslation('common')

    const { messages, chatListing, setChatListingVisible, interlocutor, currentChatId } = useChats();

    const { error } = useWebSocket();

    const messagesContainer = useRef(null);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        console.log(currentChatId)
    }, [currentChatId])

    return (
        <div className={`chat-window ${currentChatId ? "show" : ""}`}>
            <div className="chat-container">
                <div className="chat-header">
                    <div className="chat-user">
                        <button 
                            id="dialogsToggleBtn" 
                            onClick={() => changeChat(null, {})} 
                            className="mobile-dialogs-toggle"
                        >
                            <i className="fa-regular fa-arrow-left fa-2xl"></i>
                        </button>
                        <Avatar user={interlocutor} size={40} />
                        <div>
                            <h4 id="interlocutorName">{interlocutor?.name}</h4>
                            <p className="user-status"></p>
                        </div>
                    </div>
                    <div className="mobile-chat-actions">
                        {chatListing?.id && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
                            >
                                <i className="fa-regular fa-cards-blank fa-lg"></i>
                            </button>
                        )}
                        <Link 
                            to={`/profile/${interlocutor?.id}`} 
                            className="btn btn-outline-primary btn-sm"
                        >
                            <i className="fa-regular fa-user fa-lg"></i>
                        </Link>
                    </div>
                    <div className="chat-actions">
                        {/* <button className="btn btn-outline-danger btn-sm">Заблокировать</button> */}
                        {chatListing?.id && (
                            <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => setChatListingVisible(prev => !prev)}
                            >{t(`messenger.listing`, { ns: 'buttons' })}</button>
                        )}
                        <Link 
                            to={`/profile/${interlocutor?.id}`} 
                            className="btn btn-outline-primary btn-sm"
                        >
                            {t(`messenger.profile`, { ns: 'buttons' })}
                        </Link>
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