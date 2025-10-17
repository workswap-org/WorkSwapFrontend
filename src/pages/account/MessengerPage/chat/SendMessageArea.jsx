import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    useChatSubscription ,
    useWebSocket,
    useAuth
} from "@core/lib";

const SendMessageArea = ({ currentChatId }) => {
    const { user } = useAuth();

    const { client, connected } = useWebSocket();
    const { setMessages } = useChatSubscription(currentChatId);
    const { t } = useTranslation();
    const [message, setMessage] = useState("");

    // Проверка, можно ли писать сообщение
    const isDisabled = !currentChatId;

    const sendMessage = () => {

        if (!connected || !client) return;

        if (!currentChatId) {
            alert("Пожалуйста, выберите диалог для отправки сообщения");
            return;
        }

        const trimmed = message.trim();
        if (!trimmed) return;

        const newMsg = {
            chatId: currentChatId,
            own: true,
            sentAt: new Date(),
            text: trimmed,
            id: `temp-${Date.now()}`
        }

        setMessages(prev => [...prev, newMsg]);
        
        const msg = {
            text: trimmed,
            senderId: user.id,
            chatId: currentChatId
        };

        client.publish({
            destination: `/app/chat.message-send`,
            body: JSON.stringify(msg)
        });

        setMessage(""); // очищаем поле ввода
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="message-input-container">
            <textarea
                id="message-input"
                className="message-input"
                placeholder={isDisabled ? "" : t(`placeholders.typeMessage`, { ns: 'common' })}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
            />
            <button
                className="send-btn"
                onClick={sendMessage}
                disabled={isDisabled}
            >
                <img src="/images/send-btn.png" alt="Отправить" />
            </button>
        </div>
    );
};
export default SendMessageArea;