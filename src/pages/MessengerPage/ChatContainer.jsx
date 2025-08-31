import Avatar from "@/components/small-components/Avatar"
import Message from "@/components/chat/Message";
import SendMessageArea from "@/components/chat/SendMessageArea";
import { useChatSubscription } from "@/hooks/messenger/useChatSubscription";

const ChatContainer = ({ currentChatId }) => {

    const { messages } = useChatSubscription(currentChatId);

    return (
        <div className="chat-container"
            data-chat-id="${selectedChat.id}">
            <div className="chat-header">
                <div className="chat-user">
                    <Avatar 
                        user={undefined}
                        size={50}
                        className=''
                    />
                    <div>
                        <h4 id="interlocutorName"></h4>
                        <p className="user-status"></p>
                    </div>
                </div>
                <div className="chat-actions">
                    <button className="btn btn-outline-danger btn-sm" th:text="#{my.messages.button.block}">Заблокировать</button>
                    <button className="btn btn-primary btn-sm" id="listingGetBtn" style={{ display: "none" }}>Объявление</button>
                    <button className="btn btn-outline-primary btn-sm" th:text="#{my.messages.button.profile}">Профиль</button>
                </div>
            </div>

            <div className="messages-container" id="messages-container">
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