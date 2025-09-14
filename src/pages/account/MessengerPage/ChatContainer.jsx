import Message from "./chat/Message";
import SendMessageArea from "./chat/SendMessageArea";
import { useChatSubscription } from "@/hooks/messenger/useChatSubscription";
import { useRef, useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { useStompClient } from "@/hooks/messenger/useStompClient";

const ChatContainer = ({ 
    currentChatId, 
    interlocutor, 
    setChatListing, 
    chatListing, 
    toggleChatListing,
    showMobileDialogs
}) => {

    const { error } = useStompClient();

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
                    <Link to={`/profile/${interlocutor.id}`} className="btn btn-outline-primary btn-sm">Профиль</Link>
                    {chatListing && (
                        <button className="btn btn-primary btn-sm" onClick={() => toggleChatListing()}>Объявление</button>
                    )}
                </div>
            </div>

            <div 
                className="messages-container" 
                ref={messagesContainer}
            >
                {error && (
                    <div className="web-socket-connection-status">
                        <span>Ошибка подключения к серверу! Переподключение</span>
                        <br/>
                        <i className="fa-solid fa-spinner-third fa-spin"></i>
                    </div>
                )}
                <div className="message-date">Сегодня</div>

                {(messages.length === 0 && !error) && (
                    <p className="no-messages">Нет сообщений</p>
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