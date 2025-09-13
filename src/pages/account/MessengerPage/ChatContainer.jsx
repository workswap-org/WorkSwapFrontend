import Message from "@/components/chat/Message";
import SendMessageArea from "@/components/chat/SendMessageArea";
import { useChatSubscription } from "@/hooks/messenger/useChatSubscription";
import { useRef, useEffect } from "react";
import { apiFetch } from "@/lib/apiClient";
import { Link } from "react-router-dom";

const ChatContainer = ({ currentChatId, interlocutor, setChatListing, chatListing, toggleChatListing}) => {

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
                    <img className="avatar p50-avatar" src={interlocutor.avatarUrl ?? "/images/avatar-placeholder.png"} alt="Аватар" />
                    <div>
                        <h4 id="interlocutorName">{interlocutor.name}</h4>
                        <p className="user-status"></p>
                    </div>
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
                <div className="message-date">Сегодня</div>

                {messages.length === 0 && (
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